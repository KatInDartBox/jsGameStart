import { config } from "../config.js";
import { getImage } from "../utils/getImage.js";
import { getNextPosition } from "../utils/getNextPosition.js";
import { getRnd } from "../utils/getRnd.js";
import { getRad } from "../utils/getRad.js";

/** @typedef {import('../state.js').tState} tState */

const basePath = "../../assets/SpaceShooterRedux/PNG/Meteors";
const path = {
  white: [`${basePath}/meteorGrey_tiny1.png`, `${basePath}/meteorGrey_tiny2.png`],
  brown: [`${basePath}/meteorBrown_tiny1.png`, `${basePath}/meteorBrown_tiny2.png`],
};

export class Particle {
  /**
   * @param  {tState} state
   * @param  {import('../bullet.js').Bullet} bullet
   * @param {number} radius
   * @param {'white'|'brown'} color
   */
  constructor(state, x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius + getRnd(1, 4);
    this.color = color;
    this.angle = getRad(getRnd(0, 360));
    this.speed = getRnd(1, 5);
    this.img = state.assets.particle[this.color][getRnd(0, 1)];
  }

  /** @param {tState} state */
  draw(state) {
    const ctx = state.ctx;
    ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
  }
  /** @param {tState} state */
  update(state) {
    this.draw(state);
    this.speed *= config.friction;
    const nextPost = getNextPosition(this.x, this.y, this.angle, this.speed);
    this.x = nextPost.x;
    this.y = nextPost.y;
  }
}

/** @param {tState} state */
export async function loadParticleImage(state) {
  const imgs = await Promise.all([
    getImage(path.white[0]),
    getImage(path.white[1]),
    getImage(path.brown[0]),
    getImage(path.brown[1]),
  ]);
  state.assets.particle = {
    white: imgs.slice(0, 2),
    brown: imgs.slice(2),
  };
}

/** 
 * @param {tState} state 
 * @param {'rockS'|'rockM'|'rockX'} rockType 
 * @param {number} x top center x coordinate
 * @param {number} y top center y coordinate
 
*/
export function handleAddParticle(state, rockType, x, y) {
  const rType = rockType;
  const no = {
    rockS: 3,
    rockM: 5,
    rockX: 8,
  };
  const radius = {
    rockS: 5,
    rockM: 7,
    rockX: 9,
  };
  const color = rType === "rockX" ? "white" : "brown";
  const rockNo = no[rType] + getRnd(1, 4);
  for (let i = 0; i < rockNo; i++) {
    const particle = new Particle(state, x, y, radius[rType], color);

    state.particles.push(particle);
  }
}

/**
 *
 * @param {tState} state
 */
export function handleUpdateParticle(state) {
  const particles = state.particles;
  const len = particles.length;
  for (let i = len - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update(state);
    if (particle.speed <= 0.01) {
      particle.radius -= 0.3;
    }
    if (particle.radius <= 0) {
      particles.splice(i, 1);
      state.particles = particles;
    }
  }
}
