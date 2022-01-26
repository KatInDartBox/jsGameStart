import { config } from "./config.js";
import { handleAddParticle } from "./enemies/particle.js";
import { Box } from "./utils/box.js";
import { getBoundingClientRect } from "./utils/getBoundingClientRect.js";
import { getImage } from "./utils/getImage.js";
import { getVerticesBbox } from "./utils/getVertices.js";

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
    this.velocity = {
      x: 0,
      y: 0,
    };
    state.player = this;
    this.draw(state);
  }

  /** @param {import('./state.js').tState} state */
  draw(state) {
    const ctx = state.ctx;
    const bbox = this.bbox;
    ctx.drawImage(this.img, this.x, this.y, bbox.width, bbox.height);

    // draw rectangle
    // ctx.strokeStyle = "#cc2020";

    // ctx.strokeRect(bbox.centerTop.x - 8, bbox.top, 16, bbox.height / 2);
    // ctx.strokeRect(bbox.left, bbox.top + bbox.height / 2, bbox.width, bbox.height / 2);
  }

  /** @param {import('./state.js').tState} state */
  update(state) {
    this.draw(state);
    const dx = state.mouse.x - Math.floor(this.bbox.center.x);
    // console.log(`update player: `, dx);
    const vx = dx > 0 ? config.playerSpeed : -1 * config.playerSpeed;
    if (Math.abs(dx) > 3) {
      this.velocity = { x: vx, y: 0 };
      this.x += this.velocity.x;
    } else {
      this.x += dx;
    }
  }

  get bBoxes() {
    const bbox = this.bbox;
    const b1 = getBoundingClientRect(bbox.centerTop.x - 8, bbox.top, 16, bbox.height / 2);
    const b2 = getBoundingClientRect(bbox.left, bbox.top + bbox.height / 2, bbox.width, bbox.height / 2);
    return [b1, b2];
  }
  get vertices() {
    const bbox = this.bBoxes;
    const b1 = bbox[0];
    const b2 = bbox[1];

    return [...getVerticesBbox(b1), ...getVerticesBbox(b2)];
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

/**
 * @param {import('./state.js').tState} state
 * @param {'rockS'|'rockM'|'rockX'} type
 * @param {number} x
 * @param {number} y
 */
export function handleHitPlayer(state, type, x, y) {
  handleAddParticle(state, type, x, y);
  state.hp -= 1;
  if (state.hp <= 0) {
    setTimeout(() => {
      state.isGameOver = true;
    }, 100);
  }
}
