import playerFactory from "../factories/player-factory";
import { displayModal } from "./modal-controller";

// DOM CACHE
const elContainer = document.getElementById('container');

// VARIABLES
const afterAttackDelay = 1300;
const aiDiscoveredCoordinates = [];

function clearElementChildren(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

function createRow(parentElement, currentRow) {
  const row = parentElement.appendChild(document.createElement('div'));
  row.classList.add('row');
  row.dataset.row = currentRow;
  return row;
}

function setAttackedCell(element, isTargetShip) {
  element.disabled = true;
  element.classList.add('shot');
  element.classList.remove('enabled');
  if (isTargetShip) {
    element.classList.add('hit');
  }
}

function aiMove(playerOne, playerAi) {
  const aiAttackCoords = playerAi.referenceBoard.getAiMove(aiDiscoveredCoordinates);
  playerAi.referenceBoard.receiveAttack(aiAttackCoords);
  const target = playerOne.playerBoard.receiveAttack(aiAttackCoords);
  console.log(`AI ATTACK:`, aiAttackCoords);

  if (target !== null) {
    aiDiscoveredCoordinates.push(
      {
        coords: aiAttackCoords,
        isSunk: () => target.isSunk(),
      }
    );
  }
}

function displayWinner(player) {
  console.log(`The winner is ${player.username}`);
}

function checkWinCondition(playerOne, playerTwo) {
  // with playerOne priority
  if (playerOne.playerBoard.areShipsSunk()) {
    displayWinner(playerTwo);
  } else if (playerTwo.playerBoard.areShipsSunk()) {
    displayWinner(playerOne);
  }
}

function updateCellAnimation(elCell, coords, toPlayer = playerFactory()) {
  const target = toPlayer.playerBoard.boardFindValue(coords);
  const isTargetShip = target !== null;
  setAttackedCell(elCell, isTargetShip);

  elCell.classList.add('hit-animation');
  elCell.addEventListener('animationend', () => {
    elCell.classList.remove('hit-animation');
    elCell.classList.add('glow-animation');

    if (isTargetShip) {
      if (target.isSunk()) {
        elCell.classList.remove('glow-animation');
        target.shipCoordinates.forEach(({ x, y }) => {
          const elCoordCell = document.querySelector(`.current-reference-board .cell[data-x="${x}"][data-y="${y}"]`);
          elCoordCell.classList.add(target.shipName);
          elCoordCell.classList.add('animate');
        });
      }
    }
  });
}

function nextPlayerMove(fromPlayer, toPlayer) {
  if (toPlayer.isCpu) {
    aiMove(fromPlayer, toPlayer);
    checkWinCondition(toPlayer, fromPlayer);
    displayGameBoard(fromPlayer, toPlayer);
  } else {
    checkWinCondition(fromPlayer, toPlayer);
    displayGameBoard(toPlayer, fromPlayer);
  }
}

function removeCellsEnabledStatus() {
  const elActiveCells = document.querySelectorAll('.current-reference-board .cell');
  elActiveCells.forEach((elCell) => {
    elCell.classList.remove('enabled');
  });
}

function attackTile(e, fromPlayer = playerFactory(), toPlayer = playerFactory()) {
  if (!e.target.classList.contains('enabled')) return;
  removeCellsEnabledStatus();

  const attackCoords = { x: parseInt(e.target.dataset.x, 10), y: parseInt(e.target.dataset.y, 10) };
  console.log(`${fromPlayer.username} ATTACK:`, attackCoords);
  toPlayer.playerBoard.receiveAttack(attackCoords);
  fromPlayer.referenceBoard.receiveAttack(attackCoords);

  updateCellAnimation(e.target, attackCoords, toPlayer);

  setTimeout(() => nextPlayerMove(fromPlayer, toPlayer), afterAttackDelay);
}

function getCoordsStatus(boardObject, coords) {
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

function createCell(elRow, coords) {
  const cell = elRow.appendChild(document.createElement('div'));
  cell.dataset.x = coords.x;
  cell.dataset.y = coords.y;
  cell.classList.add('cell');
  return cell;
}

function generateGridCells(activeBoardObj, fromPlayer, toPlayer, canAttack) {
  const elGridDiv = document.createElement('div');
  elGridDiv.classList.add('grid');
  let currentRow = 0;
  let elRow = createRow(elGridDiv, currentRow);
  activeBoardObj.board.forEach((value, coords) => {
    if (currentRow !== coords.y) {
      currentRow = coords.y;
      elRow = createRow(elGridDiv, currentRow);
    }
    const elCell = createCell(elRow, coords);
    const hitStatus = getCoordsStatus(
      canAttack ? toPlayer.playerBoard : fromPlayer.playerBoard,
      coords
    );

    if (hitStatus.ship !== null && hitStatus.hit === true) {
      setAttackedCell(elCell, true);
      if (hitStatus.ship.isSunk()) {
        elCell.classList.add(hitStatus.ship.shipName);
      }
    } else if (hitStatus.hit === true) {
      setAttackedCell(elCell, false);
    }
    if (canAttack === true && hitStatus.hit === false) {
      // Board is attackable by active player
      elCell.classList.add('enabled');
      elCell.addEventListener('click', (e) => attackTile(e, fromPlayer, toPlayer), { once: true });
    }

    if (value !== null) {
      elCell.classList.add(value.shipName);
    }
  });
  return elGridDiv;
}

function displayGameBoard(fromPlayer, toPlayer) {
  if (!toPlayer.isCpu) {
    displayModal(document.body, `Pass the device to ${fromPlayer.username}`);
  }

  clearElementChildren(elContainer);
  const elGameWindow = elContainer.appendChild(document.createElement('div'));
  elGameWindow.classList.add('game-area');

  const elCurrentPlayerBoard = elGameWindow.appendChild(document.createElement('div'));
  elCurrentPlayerBoard.classList.add('current-player-board');
  elCurrentPlayerBoard.appendChild(
    generateGridCells(
      fromPlayer.playerBoard,
      fromPlayer,
      toPlayer,
      false
    ));

  const elCurrentPlayerName = elGameWindow.appendChild(document.createElement('p'));
  elCurrentPlayerName.textContent = `Current turn ${fromPlayer.username}`;
  elCurrentPlayerName.classList.add('player-name');

  const elCurrentReferenceBoard = elGameWindow.appendChild(document.createElement('div'));
  elCurrentReferenceBoard.classList.add('current-reference-board');
  elCurrentReferenceBoard.appendChild(
    generateGridCells(
      fromPlayer.referenceBoard,
      fromPlayer,
      toPlayer,
      true
    ));
}

function initGame(playerOne, playerTwo) {
  displayGameBoard(playerOne, playerTwo);
}

export default initGame;
