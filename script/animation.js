import { handleUpdateBullets } from "./bullet.js";

/**
 * @param {import('./state.js').tState} state
 *
 * */
export const animation = (state) => {
  const canvas = state.canvas;
  const ctx = state.ctx;

  state.frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.player) state.player.update(state);
  handleUpdateBullets(state);
  if (state.isPlaying && !state.isGameOver) window.requestAnimationFrame(() => animation(state));
};
