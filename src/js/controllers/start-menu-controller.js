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
  elInputUsernameOne.classList.add('username-one');
  elInputUsernameOne.placeholder = 'Player 1';

  const elInputUsernameTwo = elInputDiv.appendChild(document.createElement('input'));
  elInputUsernameTwo.classList.add('username-two');
  elInputUsernameTwo.placeholder = 'Player 2';

  const elLabelAiToggle = elInputDiv.appendChild(document.createElement('label'));
  elLabelAiToggle.textContent = 'AI toggle';

  const elInputAiToggle = elLabelAiToggle.appendChild(document.createElement('input'));
  elInputAiToggle.type = 'checkbox';
  elInputAiToggle.addEventListener('click', (e) => toggleAi(e, elInputUsernameTwo));

  // SUBMIT
  const elSubmit = elForm.appendChild(document.createElement('button'));
  elSubmit.type = 'submit';
  elSubmit.textContent = 'Start';

  // TEMP VALUES
  elInputUsernameOne.value = 'Renekris';
  elInputUsernameTwo.value = 'Sirkener';
}

function initDisplay() {
  displayStartMenu();
}

export default initDisplay;
