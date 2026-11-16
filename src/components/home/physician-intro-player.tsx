'use client';

import { Player } from '@remotion/player';
import { PhysicianIntro } from '@/remotion/PhysicianIntro';
import { useEffect, useState } from 'react';
import type {
  PhysicianIntroProps,
} from '@/features/types/physician-intro-props.types';
import { AudioResponse } from '@/features/types/audio.types';

export default function PhysicianIntroPlayer() {
  const [audioUrls, setAudioUrls] = useState<
    PhysicianIntroProps['audioUrls'] | null
  >(null);

  //   useEffect(() => {
  //     async function fetchAudioUrls() {
  //       const response = await fetch("/api/audio/remotion");
  //       const data = await response.json();
  //       setAudioUrls(data.audioUrls);
  //     }

  //     fetchAudioUrls();
  //   }, []);

  //   if (!audioUrls) {
  //     return null;
  //   }
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAudio() {
      try {
        const response = await fetch('/api/audio/remotion');

        if (!response.ok) {
          throw new Error('Unable to load audio recordings.');
        }

        const data: AudioResponse = await response.json();

        if (!data.success || data.audios.length < 4) {
          throw new Error('Four audio recordings are required.');
        }

        setAudioUrls({
          profile: data.audios[0].src,
          patientCare: data.audios[1].src,
          credentials: data.audios[2].src,
          locations: data.audios[3].src,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Audio loading failed.');
      }
    }

    loadAudio();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!audioUrls) {
    return <p>Loading physician introduction...</p>;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <Player
        component={PhysicianIntro}
        inputProps={{ audioUrls }}
        durationInFrames={660}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls
        style={{
          width: '100%',
        }}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
