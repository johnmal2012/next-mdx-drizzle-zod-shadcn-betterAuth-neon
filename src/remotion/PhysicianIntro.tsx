// Remotion composition to register a renderable video and <Sequence> components to place scenes on the timeline
import type {
  PhysicianIntroProps,
  WebsiteProfile,
  PhysicianCredentials,
} from '@/features/types/physician-intro-props.types';
import { type FC, type ReactNode } from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  //   Html5Audio,
} from 'remotion';
import { Audio } from '@remotion/media';
import { normalizeClinics } from '@/features/clinics/utils/normalize-clinics';

const navy = '#16324F';
const teal = '#2B7A78';

const scenes = [
  { from: 0, duration: 180 },
  { from: 180, duration: 180 },
  { from: 360, duration: 180 },
  { from: 540, duration: 180 },
];

function FadeText({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  // gets the current frame number of the video being rendered by Remotion and stores it in a variable called frame
  const frame = useCurrentFrame();

  // fade-in effect
  // interpolate(inputValue, inputRange, outputRange, options)
  // 0 = completely transparent; 1 = fully visible
  // Because your FPS is 30, 18 frames represent: 0.6 seconds = 18 / 30
  // Clamping = stop at the boundary; does not control how fast the animation runs. It only prevents the calculated value from going below (min) or above (max) the specified output range
  // other values: extend = continue the mathematical progression; wrap = repeat the range
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // slide-up effect
  // At the beginning: move down 20 pixels; at the end: move to 0 pixels i.e. original position
  const translateY = interpolate(frame, [delay, delay + 18], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Render the animated content:
  // opacity = controls the vertical position; transform = controls the vertical position
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
}

function SceneBackground({
  image,
  fill,
}: {
  image: string;
  fill: 'cover' | 'contain' | 'fill';
}) {
  const src = staticFile(`remotion/${image}`);

  return (
    <>
      <Img
        src={src}
        onError={() => {
          console.error(`Failed to load Remotion image: ${src}`);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: fill,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(12,32,52,0.88), rgba(12,32,52,0.18))',
        }}
      />
    </>
  );
}

function PhysicianScene({ profile }: { profile: WebsiteProfile }) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: navy,
        color: 'white',
      }}
    >
      <SceneBackground image="aaron-profile.jpg" fill="contain" />

      {/* Text positioned on the left side */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 220,
          width: 620,
          zIndex: 2,
        }}
      >
        {/* Introduction */}
        <FadeText>
          <div
            style={{
              color: '#B8E3DF',
              fontSize: 25,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Meet{' '}
            {profile?.specialty ?? 'Foot and Ankle Surgery, Orthopedic Surgery'}
          </div>
        </FadeText>

        {/* Physician name */}
        <FadeText delay={12}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: 620,
              marginBottom: 18,
            }}
          >
            Dr. {profile?.name ?? 'Arron Lam, DPM'}
          </div>
        </FadeText>

        {/* Professional title */}
        <FadeText delay={22}>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 600,
            }}
          >
            {profile?.specialty ?? 'Podiatrist & Foot & Ankle Surgeon'}
          </div>
        </FadeText>
      </div>
    </AbsoluteFill>
  );
}

function ExpertiseScene() {
  const topics = [
    'Foot & ankle care',
    'Personalized treatment',
    'Patient-focused care',
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: navy, color: 'white' }}>
      <SceneBackground image="patient-care.png" fill="contain" />
      <div style={{ position: 'absolute', left: 100, top: 125 }}>
        <FadeText>
          {/* <h2 style={{ fontSize: 60, marginBottom: 20 }}>
            Expertise & patient care
          </h2> */}
          <div
            style={{
              color: '#B8E3DF',
              fontSize: 28,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            Expertise & patient care
          </div>
        </FadeText>

        {topics.map((topic, index) => (
          <FadeText key={topic} delay={18 + index * 24}>
            <div
              style={{
                fontSize: 34,
                marginTop: 20,
                padding: '18px 26px',
                backgroundColor: 'rgba(255,255,255,0.13)',
                borderLeft: `5px solid ${teal}`,
                width: 680,
              }}
            >
              {topic}
            </div>
          </FadeText>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function CredentialsScene({
  credentials,
}: {
  credentials: PhysicianCredentials;
}) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: navy,
        color: 'white',
      }}
    >
      {/* Background image */}
      <SceneBackground image="credentials.jpg" fill="cover" />

      <div style={{ position: 'absolute', left: 100, top: 125 }}>
        {/* Main heading */}
        <FadeText>
          <div
            style={{
              color: '#B8E3DF',
              fontSize: 28,
              letterSpacing: 5,
              textTransform: 'uppercase',
              marginBottom: 22,
            }}
          >
            Training & credentials
          </div>
        </FadeText>

        {/* Animate each credential individually */}
        {credentials.map((credential, index) => {
          const credentialDelay = 18 + index * 24;

          return (
            <FadeText
              key={`${credential.label}-${index}`}
              delay={credentialDelay}
            >
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.5,
                  marginBottom:
                    index === credentials.length - 1 ? 0 : 24,
                }}
              >
                {/* Credential label */}
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: '#B8E3DF',
                  }}
                >
                  {credential.label}
                </div>

                {/* Institution */}
                <div>{credential.institution}</div>
              </div>
            </FadeText>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function LocationsScene({
  clinics,
}: {
  clinics: NonNullable<ReturnType<typeof normalizeClinics>>;
}) {
  // Calculate the Explore button animation delay
  // For Clinic 4, the index is 3.
  // Name delay: 18 + (3 \times 30) = 108
  // Address delay: 108 + 10 = 118
  // Your FadeText animation takes 18 frames to finish.
  // Therefore: 118 + 18 = 136
  // The last address finishes at frame 136
  // Calculate the Explore button delay
  // You want the button to appear after the last address finishes.
  // For example, add another 14 frames of waiting time:
  // 136 + 14 = 150
  const lastIndex = clinics.length - 1;

  const lastAddressDelay = clinics.length > 0 ? 18 + lastIndex * 30 + 10 : 0;

  const exploreButtonDelay = lastAddressDelay + 18 + 14;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: navy,
        color: 'white',
      }}
    >
      <SceneBackground image="clinic.jpg" fill="cover" />

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 100,
          width: 1240,
        }}
      >
        {/* Main heading */}
        <FadeText>
          <div
            style={{
              color: '#B8E3DF',
              fontSize: 30,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Find a location that works for you
          </div>
        </FadeText>

        {/* Individual clinic names and addresses */}
        {clinics.map((clinic, index) => {
          const nameDelay = 18 + index * 30;
          const addressDelay = nameDelay + 10;

          return (
            <div
              key={clinic.name}
              style={{
                marginBottom: 18,
              }}
            >
              {/* Clinic name */}
              <FadeText delay={nameDelay}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: '#B8E3DF',
                    marginBottom: 4,
                  }}
                >
                  {clinic.name}
                </div>
              </FadeText>

              {/* Clinic address */}
              <FadeText delay={addressDelay}>
                <div
                  style={{
                    fontSize: 23,
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  {clinic.address}
                </div>
              </FadeText>
            </div>
          );
        })}

        {/* Explore button */}
        {/* <FadeText delay={35}>
          <div
            style={{
              display: 'inline-block',
              marginTop: 30,
              padding: '14px 26px',
              backgroundColor: teal,
              borderRadius: 8,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Explore Clinic Locations
          </div>
        </FadeText> */}

        <FadeText delay={exploreButtonDelay}>
          <div
            style={{
              display: 'inline-block',
              marginTop: 12,
              padding: '14px 26px',
              backgroundColor: teal,
              borderRadius: 8,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Explore Clinic Locations
          </div>
        </FadeText>
      </div>
    </AbsoluteFill>
  );
}

export const PhysicianIntro: FC<PhysicianIntroProps> = ({
  audioUrls,
  websiteData,
}) => {
  const profile =
    websiteData && 'profile' in websiteData ? websiteData.profile : null;

  const clinics = normalizeClinics(profile?.clinics) ?? [];

  const credentials = profile?.credential ?? [];
  return (
    <AbsoluteFill style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Narration for the entire video in here*/}
      {/* Scene 1: Physician introduction */}
      <Sequence from={scenes[0].from} durationInFrames={scenes[0].duration}>
        <PhysicianScene profile={profile} />
        {/* <Html5Audio src={staticFile('audio/aaron-lam.m4a')} /> */}
        {audioUrls?.profile ? <Audio src={audioUrls.profile} /> : null}
      </Sequence>

      {/* Scene 2: Expertise and patient care */}
      <Sequence from={scenes[1].from} durationInFrames={scenes[1].duration}>
        <ExpertiseScene />
        {/* <Html5Audio src={staticFile('audio/patient-care.m4a')} /> */}
        {audioUrls?.patientCare ? <Audio src={audioUrls.patientCare} /> : null}
      </Sequence>

      {/* Scene 3: Training and credentials */}
      <Sequence from={scenes[2].from} durationInFrames={scenes[2].duration}>
        <CredentialsScene credentials={credentials ?? []} />
        {/* <Html5Audio src={staticFile('audio/credential.m4a')} /> */}
        {audioUrls?.credentials ? <Audio src={audioUrls.credentials} /> : null}
      </Sequence>

      {/* Scene 4: Clinic locations */}
      <Sequence from={scenes[3].from} durationInFrames={scenes[3].duration}>
        <LocationsScene clinics={clinics} />
        {/* <Html5Audio src={staticFile('audio/location.m4a')} /> */}
        {audioUrls?.locations ? <Audio src={audioUrls.locations} /> : null}
      </Sequence>
    </AbsoluteFill>
  );
};
