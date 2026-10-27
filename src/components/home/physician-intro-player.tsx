'use client';

import { Player } from '@remotion/player';
import { PhysicianIntro } from '@/remotion/PhysicianIntro';

export default function PhysicianIntroPlayer() {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <Player
        component={PhysicianIntro}
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
