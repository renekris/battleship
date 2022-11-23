// DOM CACHE
const elContainer = document.getElementById('container');

function menuSubmit(e) {
  e.preventDefault();

}

function toggleAi(e, elPlayerTwo) {
  if (e.target.checked) {
    elPlayerTwo.disabled = true;
  } else {
    elPlayerTwo.disabled = false;
  }
}

function displayStartMenu() {
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
}

export default displayStartMenu;
