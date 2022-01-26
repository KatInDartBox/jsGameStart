import { config } from "./config.js";
import { initState } from "./state.js";

/** @typedef {import('./state.js').tState} tState */

const elmScore = document.querySelector("#score");
const elmTime = document.querySelector("#time");
const elmHP = document.querySelector("#hp");
const elmEnemy = document.querySelector("#enemy");
const elmPlay = document.querySelector("#btnPlay");

export const boardElm = {
  score: elmScore,
  time: elmTime,
  hp: elmHP,
  enemy: elmEnemy,
  play: elmPlay,
};

/**
 * @param {import('./state.js').tState} state
 * @param {'score'|'time'|'hp'|'enemy'|'play'} elmName
 * @param {number} amount
 */
export function setBoard(elmName, amount) {
  if (elmName === "play") {
    boardElm[elmName].innerHTML = amount;
    return;
  }
  boardElm[elmName].innerText = amount;
}

/**
 * @param {import('./state.js').tState} state
 * @param {'score'|'time'|'hp'|'enemy'|'play'} elmName
 * @param {number} amount
 */
export function resetBoard() {
  elmScore.innerText = initState.score;
  elmTime.innerText = initState.time;
  elmHP.innerText = initState.hp;
  elmEnemy.innerText = initState.enemies.length;
  elmPlay.innerHTML = initState.isPlaying ? config.playSym : config.pauseSym;
}

/** @param {tState} state */
export function handleUpdateBoard(state) {
  setBoard("score", state.score);
  setBoard("time", parseInt(state.time / 1000, 10));
  setBoard("hp", state.hp);
  setBoard("enemy", state.rocks.length);
  if (state.isGameOver) {
    elmPlay.innerHTML = config.playSym;
  }
}
