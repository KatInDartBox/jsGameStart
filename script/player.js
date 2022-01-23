import { Box } from "./utils/box.js";
import { getBoundingClientRect } from "./utils/getBoundingClientRect.js";
import { getImage } from "./utils/getImage.js";

export class Player extends Box {
  constructor() {
    super();
  }

  /**
   * @param {import('./state.js').tState} state
   
   */
  async init(state) {
    const img = state.assets.player;
    this.img = img;
    if (!img) {
      this.img = await getImage("../assets/SpaceShooterRedux/PNG/playerShip1_blue.png");
      state.assets.player = this.img;
    }
    const canvas = state.canvas;
    this.width = 99 / 2;
    this.height = 75 / 2;
    // put player on bottom center
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 24;

    state.player = this;
    this.draw(state);
  }

  /** @param {import('./state.js').tState} state */
  draw(state) {
    const ctx = state.ctx;
    const bbox = this.bbox;

    // draw rectangle
    ctx.strokeStyle = "#cc2020";

    ctx.drawImage(this.img, this.x, this.y, bbox.width, bbox.height);

    ctx.strokeRect(bbox.centerTop.x - 8, bbox.top, 16, bbox.height / 2);
    ctx.strokeRect(bbox.left, bbox.top + bbox.height / 2, bbox.width, bbox.height / 2);
  }

  /** @param {import('./state.js').tState} state */
  update(state) {
    this.draw(state);
  }

  get bBoxes() {
    const bbox = this.bbox;
    const b1 = getBoundingClientRect(bbox.centerTop.x - 8, bbox.top, 16, bbox.height / 2);
    const b2 = getBoundingClientRect(bbox.left, bbox.top + bbox.height / 2, bbox.width, bbox.height / 2);
    return [b1, b2];
  }
}

/** @param {import('./state.js').tState} state */
export async function handleAddPlayer(state) {
  const player = new Player(state);
  await player.loadImage(state, "../assets/SpaceShooterRedux/PNG/playerShip1_blue.png");
  state.player = player;
  player.update(state);
  console.log(`from load player:\n`, player, player.bbox);
}
