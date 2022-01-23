import { config } from "./config.js";
import { initState } from "./state.js";

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
  elmPlay.innerText = initState.isPlaying ? config.playSym : config.pauseSym;
}
