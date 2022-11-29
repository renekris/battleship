import playerFactory from "../factories/player-factory";
import { initShipPlacement } from "./set-ships-controller";

// DOM CACHE
const elContainer = document.getElementById('container');

function menuSubmit(e) {
  e.preventDefault();
  const isAiToggled = e.target[2].checked;
  const playerOneName = e.target[0].value;
  const playerTwoName = isAiToggled ? 'CPU' : e.target[1].value;

  const playerOne = playerFactory(playerOneName);
  const playerTwo = playerFactory(playerTwoName, isAiToggled);
  initShipPlacement(playerOne, playerTwo);
}

function toggleAi(e, elPlayerTwo) {
  elPlayerTwo.disabled = e.target.checked;
  if (!elPlayerTwo.disabled) {
    elPlayerTwo.select();
  }
}

function clearElementChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

function displayStartMenu() {
  clearElementChildren(elContainer);

  const elMenuDiv = elContainer.appendChild(document.createElement('div'));
  elMenuDiv.classList.add('menu');

  const elForm = elMenuDiv.appendChild(document.createElement('form'));
  elForm.classList.add('menu-form');
  elForm.addEventListener('submit', (e) => menuSubmit(e));

  // INPUT DIV
  const elInputDiv = elForm.appendChild(document.createElement('div'));
  elInputDiv.classList.add('input-div');

  // INPUT
  const elInputUsernameOne = elInputDiv.appendChild(document.createElement('input'));
  elInputUsernameOne.value = 'Renekris';
  elInputUsernameOne.classList.add('username-one');
  elInputUsernameOne.placeholder = 'Player 1';
  elInputUsernameOne.spellcheck = false;
  elInputUsernameOne.select();

  const elInputUsernameTwo = elInputDiv.appendChild(document.createElement('input'));
  elInputUsernameTwo.disabled = true;
  elInputUsernameTwo.classList.add('username-two');
  elInputUsernameTwo.placeholder = 'Player 2';
  elInputUsernameTwo.value = 'Player 2';
  elInputUsernameTwo.spellcheck = false;

  const elLabelAiToggle = elInputDiv.appendChild(document.createElement('label'));
  elLabelAiToggle.textContent = 'Player vs. AI';

  const elInputAiToggle = elLabelAiToggle.appendChild(document.createElement('input'));
  elInputAiToggle.type = 'checkbox';
  elInputAiToggle.checked = elInputUsernameTwo.disabled;
  elInputAiToggle.addEventListener('click', (e) => toggleAi(e, elInputUsernameTwo));

  // SUBMIT
  const elSubmit = elForm.appendChild(document.createElement('button'));
  elSubmit.type = 'submit';
  elSubmit.textContent = 'Start';
}

function initDisplay() {
  displayStartMenu();
}

export default initDisplay;
