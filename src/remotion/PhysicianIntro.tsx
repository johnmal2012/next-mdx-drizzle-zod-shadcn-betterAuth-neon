// Remotion composition to register a renderable video and <Sequence> components to place scenes on the timeline
import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const navy = '#16324F';
const teal = '#2B7A78';

const scenes = [
  { from: 0, duration: 150 },
  { from: 150, duration: 180 },
  { from: 330, duration: 150 },
  { from: 480, duration: 180 },
];

function FadeText({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [delay, delay + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const translateY = interpolate(
    frame,
    [delay, delay + 18],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
}

function SceneBackground({ image }: { image: string }) {
  return (
    <>
      <Img
        src={staticFile(`remotion/${image}`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
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

function PhysicianScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: navy, color: 'white' }}>
      <SceneBackground image="aaron-profile.jpg" />
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 220,
          width: 1000,
        }}
      >
        <FadeText>
          <div
            style={{
              color: '#B8E3DF',
              fontSize: 28,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            Meet your foot & ankle specialist
          </div>
        </FadeText>

        <FadeText delay={12}>
          <h1 style={{ fontSize: 78, lineHeight: 1.1, margin: '24px 0' }}>
            Dr. Nikki Lam, DPM
          </h1>
        </FadeText>

        <FadeText delay={24}>
          <div style={{ fontSize: 34 }}>
            Board-Certified Foot & Ankle Specialist
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
      <SceneBackground image="patient-care.jpg" />
      <div style={{ position: 'absolute', left: 100, top: 125 }}>
        <FadeText>
          <h2 style={{ fontSize: 60, marginBottom: 20 }}>
            Expertise & patient care
          </h2>
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

function CredentialsScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#F5F8FA', color: navy }}>
      <SceneBackground image="credentials.jpg" />
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(245,248,250,0.90)',
          justifyContent: 'center',
          paddingLeft: 120,
        }}
      >
        <FadeText>
          <div
            style={{
              color: teal,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Professional development
          </div>
          <h2 style={{ fontSize: 62, margin: '18px 0 30px' }}>
            Training & credentials
          </h2>
        </FadeText>

        <FadeText delay={18}>
          <div style={{ fontSize: 34, lineHeight: 1.8 }}>
            Education • Residency
            <br />
            Fellowship • Certification
          </div>
          <div style={{ fontSize: 22, marginTop: 20 }}>
            Replace these labels with verified profile details.
          </div>
        </FadeText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function LocationsScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: navy, color: 'white' }}>
      <SceneBackground image="clinic.jpg" />
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 170,
          width: 1100,
        }}
      >
        <FadeText>
          <h2 style={{ fontSize: 66, marginBottom: 24 }}>
            Convenient clinic locations
          </h2>
        </FadeText>

        <FadeText delay={15}>
          <div style={{ fontSize: 34, lineHeight: 1.6 }}>
            Find a location that works for you.
          </div>
        </FadeText>

        <FadeText delay={35}>
          <div
            style={{
              display: 'inline-block',
              marginTop: 45,
              padding: '18px 30px',
              backgroundColor: teal,
              borderRadius: 8,
              fontSize: 30,
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

export const PhysicianIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: 'Arial, sans-serif' }}>
      <Sequence from={scenes[0].from} durationInFrames={scenes[0].duration}>
        <PhysicianScene />
      </Sequence>

      <Sequence from={scenes[1].from} durationInFrames={scenes[1].duration}>
        <ExpertiseScene />
      </Sequence>

      <Sequence from={scenes[2].from} durationInFrames={scenes[2].duration}>
        <CredentialsScene />
      </Sequence>

      <Sequence from={scenes[3].from} durationInFrames={scenes[3].duration}>
        <LocationsScene />
      </Sequence>
    </AbsoluteFill>
  );
};
