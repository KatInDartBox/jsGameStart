import { config } from "../config.js";
import { handleHitPlayer } from "../player.js";
import { is2PolyCollide } from "../utils/collision/poly2poly.js";
import { getImage } from "../utils/getImage.js";
import { Polygon } from "../utils/shapes/polygon.js";

// import { drawPoints } from "../utils/drawPoints.js";

/** @typedef {import('../state.js').tState} tState */

export class BossBullet extends Polygon {
  /**
   *
   * @param {tState} state circle center x
   * @param {number} x circle center x
   * @param {number} y circle center y
   * @param {number} r circle radius
   */
  constructor(state) {
    const boss = state.boss;
    const bossBox = boss.bbox;
    super(bossBox.centerBottom.x, bossBox.centerBottom.y, 15, 4, 0);

    this.img = state.assets.bossBullet;

    this.speed = 1 * config.bossBullet;
  }

  /** @param {tState} state */
  draw(state) {
    const ctx = state.ctx;
    const box = this.bbox;
    ctx.drawImage(this.img, box.left, box.top, box.width, box.height);

    // draw shape
    // console.log(`from v  bu: `, this.vertices);
    // drawPoints(ctx, this.vertices, "#cecece");
  }

  /** @param {tState} state */
  update(state) {
    this.draw(state);
    this.center.y += this.speed;
  }
}

/** @param {tState} state */
export async function handleAddBossBullet(state) {
  const boss = state.boss;
  const player = state.player;
  let img = state.assets.bossBullet;
  if (!img) {
    img = await getImage("../../assets/SpaceShooterRedux/PNG/Lasers/laserBlue08.png");
    state.assets.bossBullet = img;
  }
  const gap = Math.abs(boss.bbox.center.x - player.bbox.center.x);

  if (gap <= 60 && state.frame % 20 === 0) {
    const bullet = new BossBullet(state);
    state.bossBullets.push(bullet);
  }
}

/** @param {tState} state */
export async function handleUpdateBossBullets(state) {
  const boss = state.boss;
  const player = state.player;
  if (!boss || !player) return;
  await handleAddBossBullet(state);

  const bullets = state.bossBullets;
  // console.log(`from bullet len:\n`, bullets.length);

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.update(state);

    const isHitPlayer = is2PolyCollide(bullet.vertices, player.vertices);
    if (isHitPlayer) {
      bullets.splice(i, 1);
      handleHitPlayer(state, "rockX", bullet.bbox.center.x, bullet.bbox.center.y);
    }

    if (bullet && bullet.bbox.top >= state.canvas.height + 12) {
      bullets.splice(i, 1);
      break;
    }
  }
}
