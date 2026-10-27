// Register the video

import React from 'react';
import { Composition } from 'remotion';
import { PhysicianIntro } from './PhysicianIntro';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PhysicianIntro"
      component={PhysicianIntro}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={720} // Updated duration to 720 frames to accommodate the extended scene: 540 + 180 = 720
    />
  );
};
