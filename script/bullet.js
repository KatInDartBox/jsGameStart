import { Box } from "./utils/box.js";
import { getImage } from "./utils/getImage.js";

/** @typedef {import('./state.js').tState} tState */

export class Bullet extends Box {
  /** @param {tState} state */
  constructor() {
    super();
  }
  /** @param {tState} state */
  async init(state) {
    const player = state.player;
    const img = state.assets.bullet;
    const playerBox = player.bbox;

    this.img = img;
    if (!img) {
      this.img = await getImage("../assets/SpaceShooterRedux/PNG/Lasers/laserBlue01.png");
      state.assets.enemy = this.img;
    }
    this.width = 9 / 1.5;
    this.height = 54 / 1.5;
    this.x = playerBox.centerTop.x - this.width / 2;
    this.y = playerBox.centerTop.y - this.height;

    this.velocity = { x: 0, y: -5 };
  }

  /** @param {tState} state */
  draw(state) {
    const ctx = state.ctx;
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /** @param {tState} state */
  update(state) {
    this.draw(state);
    this.y += this.velocity.y;
  }
}

/** @param {tState} state */
export function handleUpdateBullets(state) {
  const bullets = state.bullets;
  // console.log(`from bullet len:\n`, bullets.length);

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    if (bullet.bbox.bottom + bullet.bbox.height * 0.2 <= 0) {
      bullets.splice(i, 1);
      return;
    } else {
      if (bullet) bullet.update(state);
    }
  }
}
