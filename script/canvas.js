import { throttle } from "./utils/throttle.js";
import { Bullet } from "./bullet.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const canvasBox = canvas.getBoundingClientRect();

/** @param {import('./state.js').tState} state */
export const initCanvas = (state) => {
  state.canvas = canvas;
  state.ctx = ctx;

  canvas.addEventListener(
    "keydown",
    throttle(async (e) => {
      const k = e.key;
      state.keyPress = k;

      if (state.keyPress === " ") {
        const bullet = new Bullet();
        await bullet.init(state);
        state.bullets.push(bullet);
      }
    }, 150)
  );

  return {
    canvas,
    ctx,
    canvasBox,
  };
};
