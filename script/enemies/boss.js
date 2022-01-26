import { getImage } from "../utils/getImage.js";
import { Polygon } from "../utils/shapes/polygon.js";
import { getNextPosition } from "../utils/getNextPosition.js";
import { is2PolyCollide } from "../utils/collision/poly2poly.js";
import { handleAddParticle } from "./particle.js";
import { handleUpdateBossBullets } from "./bossBullet.js";
import { config } from "../config.js";
// import { drawPoints } from "../utils/drawPoints.js";

/** @typedef {import('../utils/shapes/polygon.js').Polygon} tPolygon  */
/** @typedef {import('../state.js').tState} tState */

export class Boss extends Polygon {
  /**
   *
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} radius
   * @param {number} seq must be >= 3
   * @param {number} startAngle in deg
   */
  constructor(centerX, centerY, radius, segment, startAngle) {
    super(centerX, centerY, radius, segment, startAngle);
  }

  /**
   *
   * @param {tState} state
   * @param {string} imgPath
   */
  async init(state) {
    const img = state.assets.boss;
    this.hp = 15;
    this.elapsed = 0;
    this.img = img;
    if (!img) {
      this.img = await getImage("../../assets/SpaceShooterRedux/PNG/Enemies/enemyRed2.png");
      state.assets.boss = this.img;
    }
  }
  /** @param {tState} state */
  draw(state) {
    const ctx = state.ctx;
    const box = this.bbox;

    ctx.drawImage(this.img, box.left, box.top, box.width, box.height - 9);

    // shape
    // const pts = this.vertices;
    // drawPoints(ctx, pts, "#a33535");
    // // hp info
    // ctx.fillStyle = "#cecece";
    // ctx.fillText(this.hp, box.centerRight.x + 5, box.centerRight.y);
    // ctx.beginPath();
    // ctx.moveTo(box.centerBottom.x, box.centerBottom.y);
    // ctx.lineTo(box.centerBottom.x, box.centerBottom.y + 12);
    // ctx.stroke();
  }
  /** @param {tState} state */
  update(state) {
    this.draw(state);
    this.elapsed = state.time - config.bossAppearTime * 1000;
    const t = parseInt(this.elapsed / 1000, 10);
    const canvas = state.canvas;
    const pi = Math.PI;
    const left = pi;
    const right = 0;
    const down = pi / 2;
    const up = -pi / 2;
    const box = this.bbox;

    const move = [left, left, down, down, right, right, right, up, up, left];
    const speed = 2;
    let nextPos = getNextPosition(this.center.x, this.center.y, move[t % move.length], speed);
    if (
      nextPos.x <= box.width || //
      nextPos.x >= canvas.width - box.width
    )
      nextPos.x = this.center.x;
    if (
      nextPos.y <= box.height || //
      nextPos.y >= canvas.height / 2
    )
      nextPos.y = this.center.y;
    this.center.x = nextPos.x;
    this.center.y = nextPos.y;

    //update shape
  }
}

/** @param {tState} state  */
export async function handleAddBoss(state) {
  const time = parseInt(state.time / 1000, 10);
  const canvas = state.canvas;
  const radius = 45;
  if (time === config.bossAppearTime) {
    const boss = new Boss(canvas.width / 2, 0 + radius * 2, radius, 5, -18);
    await boss.init(state);
    state.boss = boss;
    // console.log(`from rock len:\n`, state.rocks.length);
  }
}
/** @param {tState} state  */
export async function handleUpdateBoss(state) {
  await handleAddBoss(state);
  await handleUpdateBossBullets(state);

  const boss = state.boss;
  const bullets = state.bullets;
  const bulletLen = bullets.length;

  if (!boss) return;
  boss.update(state);
  let hitBullet = false;
  for (let i = bulletLen - 1; i >= 0; i--) {
    const bullet = bullets[i];
    hitBullet = is2PolyCollide(boss.vertices, bullet.vertices);
    if (hitBullet) {
      bullets.splice(i, 1);
      boss.hp -= 1;
      handleAddParticle(state, "rockX", bullet.bbox.centerTop.x, bullet.bbox.centerTop.y);
      if (boss.hp === 0) {
        setTimeout(() => {
          state.isGameOver = true;
        }, 5000);
      }

      break;
    }
  }
  if (boss.hp <= 0) {
    boss.radius -= 0.3;
    if (boss.radius <= 0) boss.radius = 0;
  }
  if (boss.radius <= 0) {
    state.boss = undefined;
  }
}
