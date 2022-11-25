import playerFactory from "../factories/player-factory";

// DOM CACHE
const elContainer = document.getElementById('container');

function clearElementChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

// function displayGrid(x, y) {
//   const elGridDiv = elContainer.appendChild(document.createElement('div'));
//   elGridDiv.classList.add('grid');

//   for (let i = 0; i < x; i += 1) {
//     const row = elGridDiv.appendChild(document.createElement('div'));
//     row.classList.add('row');
//     for (let j = 0; j < y; j += 1) {
//       const cell = row.appendChild(document.createElement('div'));
//       cell.classList.add('cell');
//       cell.dataset.x = i;
//       cell.dataset.y = j;
//     }
//   }
// }

function createRow(parentElement, currentRow) {
  const row = parentElement.appendChild(document.createElement('div'));
  row.classList.add('row');
  row.dataset.row = currentRow;
  return row;
}

function setAttackedCell(element) {
  element.disabled = true;
  element.classList.add('attacked');
  cell.classList.remove('enabled');
}

function attackTile(e, fromPlayer) {
  const attackCoords = { x: e.target.dataset.x, y: e.target.dataset.y };
  console.log(`x: ${attackCoords.x} y: ${attackCoords.y}`);

  setAttackedCell(e.target);
  fromPlayer.attackEnemy(attackCoords);
}

function checkAttackedLocations(board, coords, callback) {
  board.receivedShots.forEach((shot) => {
    if (shot.x === coords.x && shot.y === coords.y) {
      callback();
    }
  });
}

function generateGridCells(boardObject, playerObject = null) {
  const elGridDiv = document.createElement('div');
  elGridDiv.classList.add('grid');
  let currentRow = 0;
  let row = createRow(elGridDiv, currentRow);
  boardObject.board.forEach((value, key) => {
    if (currentRow !== key.x) {
      currentRow = key.x;
      row = createRow(elGridDiv, currentRow);
    }

    const cell = row.appendChild(document.createElement('div'));
    cell.dataset.x = key.x;
    cell.dataset.y = key.y;
    cell.classList.add('cell');
    checkAttackedLocations(boardObject, key, () => setAttackedCell(cell));
    if (playerObject !== null) {
      // isAttackable
      cell.classList.add('enabled');
      cell.addEventListener('click', (e) => attackTile(e, playerObject), { once: true });
    }

    if (value !== null) {
      cell.classList.add(value.shipName);
    }
  });
  return elGridDiv;
}

function createGrid(playerObject = playerFactory(), isAttackable) {
  if (isAttackable) {
    return generateGridCells(playerObject.referenceBoard, playerObject)
  }
  return generateGridCells(playerObject.playerBoard);
}

function displayGameBoard(attackPlayer) {
  clearElementChildren(elContainer);
  const elGameWindow = elContainer.appendChild(document.createElement('div'));
  elGameWindow.classList.add('game-area');

  const elCurrentPlayerBoard = elGameWindow.appendChild(document.createElement('div'));
  elCurrentPlayerBoard.appendChild(createGrid(attackPlayer, false));
  elCurrentPlayerBoard.classList.add('current-player-board');

  const elCurrentReferenceBoard = elGameWindow.appendChild(document.createElement('div'));
  elCurrentReferenceBoard.appendChild(createGrid(attackPlayer, true));
  elCurrentReferenceBoard.classList.add('current-reference-board');
}

function initGame(playerOne, playerTwo) {
  displayGameBoard(playerOne);
  // createGrid(playerOne);
}

export default initGame;
