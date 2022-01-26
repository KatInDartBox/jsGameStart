import { Box } from "../utils/box.js";
import { getRnd } from "../utils/getRnd.js";
import { getImage } from "../utils/getImage.js";
import { getOutSidePosition } from "../utils/getOutSidePosition.js";
import { getRelativeAngle } from "../utils/getRelativeAngle.js";
import { getNextPosition } from "../utils/getNextPosition.js";
import { Polygon } from "../utils/shapes/polygon.js";
import { is2PolyCollide } from "../utils/collision/poly2poly.js";
import { handleAddParticle, loadParticleImage } from "./particle.js";
import { handleHitPlayer } from "../player.js";

/** @typedef {import('../utils/shapes/polygon.js').Polygon} tPolygon  */
/** @typedef {import('../state.js').tState} tState */

const shape = {
  /** @type {tPolygon} */
  rockS: new Polygon(-200, -200, 14, 6, -9),
  /** @type {tPolygon} */
  rockM: new Polygon(-200, -200, 16, 7, 0),
  /** @type {tPolygon} */
  rockX: new Polygon(-200, -200, 32, 6, -7),
};
const rockPathObj = {
  rockS: "../../assets/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png",
  rockM: "../../assets/SpaceShooterRedux/PNG/Meteors/meteorBrown_big3.png",
  rockX: "../../assets/SpaceShooterRedux/PNG/Meteors/meteorGrey_med2.png",
};

export class Rock extends Box {
  /**
   * @param {tState} state
   * @param {number} width
   * @param {number} height
   * @param {HTMLImageElement} img
   *
   * */
  constructor() {
    super();
  }

  /**
   *
   * @param {tState} state
   * @param {string} imgPath
   */
  async init(state) {
    const canvas = state.canvas;
    const player = state.player;
    const pBox = player.bbox;
    const outBound = getOutSidePosition(50, canvas.width, canvas.height / 3, ["left", "top", "right"]);
    this.x = outBound.x;
    this.y = outBound.y;

    this.angle = getRelativeAngle(this.x, this.y, pBox.center.x, pBox.center.y);

    const rockType = ["rockS", "rockM", "rockX"][getRnd(0, 2)];
    /** @type {"rockS"|"rockM"|"rockX"} */
    this.type = rockType;
    await loadImages(state);
    this.img = await getImg(state, rockType);

    this.height = {
      rockS: 28,
      rockM: 32,
      rockX: 60,
    }[rockType];
    this.width = (this.img.width / this.img.height) * this.height;
    /** @type {import('../utils/shapes/polygon.js').Polygon} */
    this.shape = shape[rockType];
    this.speed = 32 / this.height;
    this.isHitPlayer = false;
  }
  /** @param {tState} state */
  draw(state) {
    const ctx = state.ctx;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    // shape
    // ctx.lineWidth = 1;
    // ctx.fillStyle = "#cecece";
    // const box = this.bbox;
    // ctx.fillText(this.type, box.centerRight.x, box.centerRight.y);
    // this.shape.draw(ctx, "#19ecec");
  }

  update(state) {
    this.draw(state);
    const nextPos = getNextPosition(this.x, this.y, this.angle, this.speed);
    this.x = nextPos.x;
    this.y = nextPos.y;

    //update shape

    const box = this.bbox;
    this.shape.update(box.center.x, box.center.y);
  }
}
/** @param {tState} state */
async function loadImages(state) {
  if (state.assets.rockS) return;

  const imgs = await Promise.all([
    getImage(rockPathObj.rockS),
    getImage(rockPathObj.rockM), //
    getImage(rockPathObj.rockX),
  ]);
  state.assets.rockS = imgs[0];
  state.assets.rockM = imgs[1];
  state.assets.rockX = imgs[2];
}

/**
 *
 * @param {tState} state
 * @param {'rockS'|'rockM'|'rockX'} size
 */
const getImg = async (state, size) => {
  const imgPath = rockPathObj[size];
  const imgAsset = state.assets[size];
  const img = imgAsset ? imgAsset : await getImage(imgPath);

  if (!imgAsset) state.assets[size] = img;

  return img;
};

/** @param {tState} state  */
export async function handleAddRock(state) {
  const frame = state.frame;
  if (frame % 250 === 0) {
    const rock = new Rock();
    await rock.init(state);
    state.rocks.push(rock);
    // console.log(`from rock len:\n`, state.rocks.length);
  }
}
/** @param {tState} state  */
export async function handleUpdateRocks(state) {
  await handleAddRock(state);
  if (state.assets.particle.white.length === 0) {
    await loadParticleImage(state);
  }

  let rocks = state.rocks;
  for (let ir = rocks.length - 1; ir >= 0; ir--) {
    const rock = rocks[ir];

    rock.update(state);

    let isHitBullet;
    let bullets = state.bullets;
    for (let ib = bullets.length - 1; ib >= 0; ib--) {
      const bullet = bullets[ib];
      isHitBullet = is2PolyCollide(bullet.vertices, rock.shape.vertices);
      if (isHitBullet) {
        bullets.splice(ib, 1);
        rocks.splice(ir, 1);
        state.score += 10;

        handleAddParticle(state, rock.type, bullet.bbox.centerTop.x, bullet.bbox.centerTop.y);
        state.bullets = bullets;
        state.rocks = rocks;
        break;
      }
    }

    let isHitPlayer;
    const player = state.player;
    if (!isHitBullet && rock) {
      isHitPlayer = is2PolyCollide(rock.shape.vertices, player.vertices);

      if (isHitPlayer) {
        rocks.splice(ir, 1);
        handleHitPlayer(state, rock.type, rock.bbox.center.x, rock.bbox.center.y);

        break;
      }
    }

    if (!isHitPlayer && rock) {
      const bbox = rock.bbox;
      if (bbox.top > state.canvas.height + 10) {
        rocks.splice(ir, 1);

        break;
      }
    }
  }
}
