import { handleUpdateBoard } from "./board.js";
import { handleUpdateBullets } from "./bullet.js";
import { handleUpdateBoss } from "./enemies/boss.js";
import { handleUpdateParticle } from "./enemies/particle.js";
import { handleUpdateRocks } from "./enemies/rock.js";

let start = 0;
/**
 * @param {import('./state.js').tState} state
 *
 * */
export const animation = (state) => async (timestamp) => {
  if (state.frame === 0) start = timestamp;

  const elapsed = timestamp - start;
  state.time = elapsed;
  state.frame++;

  // console.log(`frame:\n`, timestamp, elapsed);

  const canvas = state.canvas;
  const ctx = state.ctx;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.player) state.player.update(state);
  handleUpdateBullets(state);
  await handleUpdateRocks(state);
  handleUpdateParticle(state);
  handleUpdateBoard(state);
  await handleUpdateBoss(state);

  if (state.isPlaying && !state.isGameOver) window.requestAnimationFrame(animation(state));
};
