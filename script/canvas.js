import { throttle } from "./utils/throttle.js";
import { Bullet } from "./bullet.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const canvasBox = canvas.getBoundingClientRect();

/** @param {import('./state.js').tState} state */
export const initCanvas = async (state) => {
  state.canvas = canvas;
  state.ctx = ctx;

  canvas.addEventListener(
    "keydown",
    throttle(async (e) => {
      const k = e.key;
      state.keyPress = k;
      const bullet = new Bullet();
      await bullet.init(state);
      if (state.keyPress === " ") {
        state.bullets.push(bullet);
      }
    }, 150)
  );

  canvas.addEventListener("mousemove", (e) => {
    state.mouse = {
      x: e.x - canvasBox.top,
      y: e.y - canvasBox.left,
    };
  });

  canvas.addEventListener("click", async (e) => {
    state.mouseClick = {
      x: e.x - canvasBox.top,
      y: e.y - canvasBox.left,
    };
    const bullet = new Bullet();
    await bullet.init(state);
    state.bullets.push(bullet);
  });

  return {
    canvas,
    ctx,
    canvasBox,
  };
};
