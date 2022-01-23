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
};

/**
 * @typedef {Object} tAsset
 * @property {HTMLImageElement} tAsset.player
 * @property {HTMLImageElement} tAsset.bullet
 * @property {HTMLImageElement} tAsset.enemy
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
  assets: { player: undefined, bullet: undefined, enemy: undefined },
  /** @type {import('./bullet.js').Bullet[]} */
  bullets: [],
};

export function resetState() {
  for (const [k, v] of Object.entries(initState)) {
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

export class State {}
