export const initState = {
  score: 0,
  hp: 5,
  time: 0,
  enemies: [],
  isPlaying: false,
  isGameOver: false,
  /** @type {'a'|'d'|' '|'w'} */
  keyPress: undefined,
  frame: 0,
  mouse: {
    x: undefined,
    y: undefined,
  },
  mouseClick: {
    x: undefined,
    y: undefined,
  },
};

/**
 * @typedef {Object} tAsset
 * @property {HTMLImageElement} tAsset.player
 * @property {HTMLImageElement} tAsset.bullet
 * @property {HTMLImageElement} tAsset.rockS
 * @property {HTMLImageElement} tAsset.rockM
 * @property {HTMLImageElement} tAsset.rockX
 * @property {HTMLImageElement} tAsset.boss
 * @property {HTMLImageElement} tAsset.bossBullet
 * @property {{white:HTMLImageElement[],brown:HTMLImageElement[]}} tAsset.particle
 */

export const defaultState = {
  ...initState,
  /** @type {HTMLCanvasElement} */
  canvas: undefined,
  /** @type {CanvasRenderingContext2D} */
  ctx: undefined,
  /** @type {import('./player.js').Player} */
  player: undefined,
  /** @type {tAsset} */
  assets: {
    player: undefined,
    bullet: undefined,
    rockS: undefined,
    rockM: undefined,
    rockX: undefined,
    boss: undefined, //
    bossBullet: undefined, //
    particle: {
      white: [],
      brown: [],
    },
  },
  /** @type {import('./bullet.js').Bullet[]} */
  bullets: [],
  /** @type {import('./enemies/rock.js').Rock[]} */
  rocks: [],
  /** @type {import('./enemies/particle.js').Particle[]} */
  particles: [],
  /** @type {import('./enemies/boss.js').Boss} */
  boss: undefined,
  /** @type {import('./enemies/bossBullet.js').BossBullet[]} */
  bossBullets: [],
};

export function resetState(state) {
  const destState = {
    score: 0,
    hp: 5,
    time: 0,
    enemies: [],
    rocks: [],
    isPlaying: true,
    isGameOver: false,
    bossBullets: [],
    boss: undefined,
    frame: 0,
  };
  for (const [k, v] of Object.entries(destState)) {
    state[k] = v;
  }
}

/** @typedef {typeof defaultState} tState */

/**
 *
 * @returns {tState}
 */
export async function handleInitState() {
  return {
    ...defaultState,
  };
}
