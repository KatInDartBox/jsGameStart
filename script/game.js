import { animation } from "./animation.js";
import { boardElm, resetBoard, setBoard } from "./board.js";
import { config } from "./config.js";
import { resetState } from "./state.js";

/** @param {import('./state.js').tState} state */
export const handlePlayPause = (state) => {
  state.isPlaying = !state.isPlaying;
  const txt = state.isPlaying ? config.pauseSym : config.playSym;
  setBoard("play", txt);

  if (state.isGameOver) {
    resetState(state);
    resetBoard();
  }
  if (state.isPlaying) {
    const canvas = state.canvas;
    canvas.focus();
  }
};

export const initGame = (state) => {
  const play = boardElm.play;

  play.addEventListener("click", async () => {
    handlePlayPause(state);
    await window.requestAnimationFrame(animation(state));
    // console.log(`from init tool:\n`, state);
  });
};
