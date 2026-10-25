// registers the Remotion entry point
// The composition is e.g. 660 frames at 30 frames per second, giving you a 22-second video. Remotion uses the registered composition ID when previewing or rendering the video
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);