import playerFactory from "../factories/player-factory";

// DOM CACHE
const elContainer = document.getElementById('container');

function clearElementChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
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

function createRow(parentElement, currentRow) {
  const row = parentElement.appendChild(document.createElement('div'));
  row.classList.add('row');
  row.dataset.row = currentRow;
  return row;
}

function displayPlayerGrid(playerObject = playerFactory()) {
  clearElementChildren(elContainer);
  const elGridDiv = elContainer.appendChild(document.createElement('div'));
  elGridDiv.classList.add('grid');

  let currentRow = 0;
  let row = createRow(elGridDiv, currentRow);
  playerObject.playerBoard.board.forEach((value, key) => {
    if (currentRow !== key.x) {
      currentRow = key.x;
      row = createRow(elGridDiv, currentRow);
    }

    const cell = row.appendChild(document.createElement('div'));
    cell.dataset.x = key.x;
    cell.dataset.y = key.y;
    cell.classList.add('cell');

    if (value !== null) {
      cell.classList.add(value.shipName);
    }
  });
}

function initGame(playerOne, playerTwo) {
  displayPlayerGrid(playerOne);
}

export default initGame;
