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

function setAttackedCell(element, hitStatus) {
  element.disabled = true;
  if (hitStatus) {
    element.classList.add('hit');
    console.log('hit!');
  }
  element.classList.add('attacked');
  element.classList.remove('enabled');
}

function attackTile(e, fromPlayer, toPlayer) {
  const attackCoords = { x: e.target.dataset.x, y: e.target.dataset.y };
  const hitStatus = fromPlayer.attackEnemy(attackCoords);
  console.log(`x: ${attackCoords.x} y: ${attackCoords.y}`);
  setAttackedCell(e.target, hitStatus);

  // add toPlayer to switch between players
  // displayGameBoard(fromPlayer);
}

function isCellHit(boardObject, coords) {
  const hitStatus = {
    hit: false,
    ship: null,
  };
  boardObject.receivedShotsMap.forEach((value, key) => {
    if (key.x === coords.x && key.y === coords.y) {
      if (value !== null) {
        hitStatus.ship = value;
      }
      hitStatus.hit = true;
    }
  });
  return hitStatus;
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

    const hitStatus = isCellHit(boardObject, key);
    if (hitStatus.ship !== null) {
      setAttackedCell(cell, true);
    } else if (hitStatus.hit === true) {
      setAttackedCell(cell, false);
    }
    if (playerObject !== null && hitStatus.hit === false) {
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
