import { loadEnvConfig } from '@next/env';
import path from 'node:path';
import { mkdir, rename } from 'node:fs/promises';

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import type { PhysicianIntroProps } from '@/features/types/physician-intro-props.types';

const projectRoot = process.cwd();
// Load .env.local and other Next.js environment files.
// static imports are processed before the module's regular code executes. Therefore, the storage module may be evaluated before loadEnvConfig() runs. Moving the environment-loading statement to the first line does not change this behavior.
loadEnvConfig(projectRoot);

async function main() {
  // Retrieve website data.
  const { getWebsiteData } = await import('@/lib/website/get-website-data');

  const websiteData = await getWebsiteData();

  // dynamic import storage module only after environment variables load and then destructure the function
  const { getPhysicianAudioAssets } =
    await import('@/lib/storage/get-physician-audio-assets');

  console.log('Retrieving physician audio assets from Neon...');

  const audioAssets = await getPhysicianAudioAssets();

  if (audioAssets.length !== 4) {
    throw new Error(`Expected 4 audio files, received ${audioAssets.length}`);
  }

  // Map audio files to their corresponding Remotion sections.
  //   const inputProps: Record<string, unknown> = {
  //     audioUrls: {
  //       profile: audioAssets[0].audioUrl,
  //       patientCare: audioAssets[1].audioUrl,
  //       credentials: audioAssets[2].audioUrl,
  //       locations: audioAssets[3].audioUrl,
  //     },
  //   };
  // Build inputProps
  const inputProps: PhysicianIntroProps = {
    audioUrls: {
      profile: audioAssets[0].audioUrl,
      patientCare: audioAssets[1].audioUrl,
      credentials: audioAssets[2].audioUrl,
      locations: audioAssets[3].audioUrl,
    },
    websiteData,
  };

  //   console.log('Audio assets retrieved: ', audioAssets);

  //   console.log('Input props for Remotion composition: ', inputProps);

  console.log('Four signed audio URLs retrieved successfully.');

  audioAssets.forEach((audio, index) => {
    console.log(`Audio ${index + 1}: ${audio.durationSeconds} seconds`);
  });

  // Create output directory.
  const outputDirectory = path.resolve('public/videos');

  await mkdir(outputDirectory, { recursive: true });

  const outputLocation = path.join(outputDirectory, 'physician-intro.mp4');

  // Rename existing video before rendering a new one.
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const archivedLocation = path.join(
    outputDirectory,
    `physician-intro-${timestamp}.mp4`,
  );

  try {
    await rename(outputLocation, archivedLocation);
    console.log(`Previous video archived: ${archivedLocation}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }

    console.log('No previous video found. Creating a new one.');
  }

  // Bundle Remotion composition.
  console.log('Bundling Remotion composition...');

  // bundle = prepare your Remotion project into a browser-ready application that Remotion can use to render your video; it does not generate your MP4. It prepares the application that Remotion will use to generate your MP4
  // returns a URL that Remotion can use to access the bundled application and subsequently passed to other Remotion functions
  // entryPoint = tell Remotion where to start loading your Remotion application
  // path.resolve() = convert a relative path into an absolute filesystem path
const serveUrl = await bundle({
  entryPoint: path.resolve(projectRoot, 'src/remotion/index.ts'),

  webpackOverride: (config) => {
    config.resolve = config.resolve ?? {};

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot + '/src',
    };

    return config;
  },
});

  // Select composition.
  console.log('Selecting PhysicianIntro composition...');

  // find and select the specific registered Remotion composition you want to render, and retrieve its configuration
  // Root.tsx might register multiple compositions and ach <Composition> represents a different video configuration.
  // id in selectComposition() of render-physician-intro.ts tells Remotion which composition you want to select which must match the id registered composition in Root.tsx
  // inputProps = supply the properties when Remotion selects and evaluates the composition configuration
  const composition = await selectComposition({
    serveUrl,
    id: 'PhysicianIntro',
    inputProps,
  });

  console.log(`Rendering ${composition.durationInFrames} frames...`);

  // Render final MP4
  // it takes the selected composition, renders its video frames, encodes the video and audio, and saves the finished MP4 file
  // H.264 = a good choice because it offers broad compatibility with Windows, macOS, iPhones and Android devices
  // inputProps = pass your final intended data into the composition during rendering
  // onProgress = define a callback that Remotion calls to report rendering progresses; callback = simply a function that another function calls when a particular event or condition occurs
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    audioCodec: 'aac',
    outputLocation,
    inputProps,

    onProgress: ({ progress }) => {
      console.log(`Rendering: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log('---------------------------------------');
  console.log('Physician introduction video generated!');
  console.log(`Output: ${outputLocation}`);
  console.log('---------------------------------------');
}

main().catch((error) => {
  console.error('Physician video rendering failed:', error);
  process.exit(1);
});
