import { handleInitState } from "./state.js";
import { initCanvas } from "./canvas.js";
import { Player } from "./player.js";
import { initGame } from "./game.js";

// testing

window.addEventListener("load", async () => {
  const state = await handleInitState();
  await initCanvas(state);
  const player = new Player();
  await player.init(state);

  initGame(state);
});
