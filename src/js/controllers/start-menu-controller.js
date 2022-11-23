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
  console.log(playerOne);
  console.log(playerTwo);
  initShipPlacement(playerOne, playerTwo);
}

function toggleAi(e, elPlayerTwo) {
  if (e.target.checked) {
    elPlayerTwo.disabled = true;
  } else {
    elPlayerTwo.disabled = false;
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

function displayGrid(x, y) {
  const elGridDiv = elContainer.appendChild(document.createElement('div'));
  elGridDiv.classList.add('grid');

  for (let i = 0; i < x; i += 1) {
    const row = elGridDiv.appendChild(document.createElement('div'));
    row.classList.add('row');
    for (let j = 0; j < y; j += 1) {
      const cell = row.appendChild(document.createElement('div'));
      cell.classList.add('cell');
      cell.dataset.x = i;
      cell.dataset.y = j;
    }
  }
}

function initDisplay() {
  displayStartMenu();
}

export default initDisplay;
