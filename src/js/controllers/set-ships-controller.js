import { clearElementChildren, initGame } from "./game-controller";

// DOM CACHE
const elContainer = document.getElementById('container');

// VARIABLES
const shipTypes = [
  {
    name: 'carrier',
    shipLength: 5,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ]
  },
  {
    name: 'battleship',
    shipLength: 4,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ]
  },
  {
    name: 'cruiser',
    shipLength: 3,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
    ]
  },
  {
    name: 'submarine',
    shipLength: 3,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
    ]
  },
  {
    name: 'destroyer',
    shipLength: 2,
    relativeCoords: [
      [0, 0],
      [0, 1],
    ]
  },
];
const draggableObjects = [];
const gridCells = [];
const placedShips = [];

class DraggableCellGroup {
  constructor(element, shipType) {
    this.isDragging = false;
    this.elGroupActiveCell = null;
    this.elCellGroup = element;
    this.shipObj = shipType;
    this.offsetX = 0;
    this.offsetY = 0;

    this.elCellGroup.addEventListener('pointerdown', (e) => this.dragStart(e), false);
    this.elCellGroup.addEventListener('pointerup', (e) => this.dragEnd(e), false);
    elContainer.addEventListener('pointermove', (e) => this.dragMove(e), false);
  }

  resetElementPosition() {
    setTranslate(0, 0, this.elCellGroup);
    [this.offsetX, this.offsetY] = [0, 0];
  }

  dragStart(e) {
    if (e.button !== 0 && e.buttons <= 1 && e.isPrimary === false) return;
    this.initialX = e.clientX - this.offsetX;
    this.initialY = e.clientY - this.offsetY;

    this.elGroupActiveCell = e.target;
    this.isDragging = true;
  }

  dragMove(e) {
    if (this.isDragging) {
      e.preventDefault();

      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;

      this.offsetX = this.currentX;
      this.offsetY = this.currentY;

      setTranslate(this.currentX, this.currentY, this.elCellGroup);
    }
  }

  dragEnd(e) {
    this.isDragging = false;
    const elShipGrid = document.querySelector('.grid');
    if (!mouseOverlap(e, elShipGrid)) {
      this.resetElementPosition();
      if (resetPlacedShip(this.shipObj.name)) {
        reDrawGridCells();
      }
      return;
    }

    const elDroppedOnCell = gridCells.filter((elCell) => mouseOverlap(e, elCell))[0];
    updateGridWithDrop(this, elDroppedOnCell);

    this.initialX = this.currentX;
    this.initialY = this.currentY;
    console.log(draggableObjects);
  }
}

function resetPlacedShip(shipName, resetElementPosition = true) {
  for (let i = 0; i < placedShips.length; i += 1) {
    const placedShip = placedShips[i];
    if (placedShip.shipName === shipName) {
      if (resetElementPosition) {
        placedShip.cellGroupObj.resetElementPosition();
      }
      placedShips.splice(i, 1);
      return true;
    }
  }
  return false;
}

function setTranslate(xPos, yPos, element) {
  element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function mouseOverlap(e, el1) {
  const domRect1 = el1.getBoundingClientRect();
  return !(
    domRect1.top > e.clientY ||
    domRect1.right < e.clientX ||
    domRect1.bottom < e.clientY ||
    domRect1.left > e.clientX
  );
}

function elementsOverlap(el1, el2) {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );
}

function resetOverlappingShips(newCoords, shipName) {
  const toRemove = [];
  for (let placedShipIndex = 0; placedShipIndex < placedShips.length; placedShipIndex += 1) {
    const placedShip = placedShips[placedShipIndex];
    if (placedShip.shipName === shipName) {
      resetPlacedShip(placedShip.shipName, false);
      break;
    }

    for (let pSI = 0; pSI < placedShip.coords.length; pSI += 1) {
      const placedCoords = placedShip.coords[pSI];
      for (let nCI = 0; nCI < newCoords.length; nCI += 1) {
        const newCoord = newCoords[nCI];
        if (newCoord[0] === placedCoords[0] && newCoord[1] === placedCoords[1]) {
          placedShip.cellGroupObj.resetElementPosition();
          toRemove.push(placedShip.shipName);
          break;
        }
      }
    }
  }
  toRemove.forEach((name) => resetPlacedShip(name));
}

function removeCellShipNames(elCell) {
  shipTypes.forEach((shipType) => {
    elCell.classList.remove(shipType.name);
  });
}

function reDrawGridCells() {
  gridCells.forEach((elCell) => {
    removeCellShipNames(elCell);
    placedShips.forEach((placedShip) => {
      placedShip.coords.forEach((placedCoords) => {
        // eslint-disable-next-line eqeqeq
        if (elCell.dataset.x == placedCoords[0] && elCell.dataset.y == placedCoords[1]) {
          elCell.classList.add(placedShip.shipName);
        }
      });
    });
  });
}

function getDatasetCoords(element) {
  return [parseInt(element.dataset.x, 10), parseInt(element.dataset.y, 10)];
}

function updateGridWithDrop(cellGroupObj, elDroppedOnCell) {
  const groupRelativeCoords = Array.from(cellGroupObj.elCellGroup.children).map((elCell) => getDatasetCoords(elCell));
  const cellActiveRelCoords = getDatasetCoords(cellGroupObj.elGroupActiveCell);
  const cellDropCoords = getDatasetCoords(elDroppedOnCell);

  const finalCoords = [];
  groupRelativeCoords.forEach((coords) => {
    finalCoords.push([(coords[0] + cellDropCoords[0]) - cellActiveRelCoords[0], (coords[1] + cellDropCoords[1]) - cellActiveRelCoords[1]]);
  });

  if (finalCoords.some((coord) => coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9)) {
    resetPlacedShip(cellGroupObj.shipObj.name, false);
    cellGroupObj.resetElementPosition();
  } else {
    resetOverlappingShips(finalCoords, cellGroupObj.shipObj.name);
    placedShips.push({
      shipName: cellGroupObj.shipObj.name,
      coords: finalCoords,
      cellGroupObj,
    });
  }
  console.log(placedShips);
  reDrawGridCells();
}

function generateShipCells(ship) {
  const elCellGroup = document.createElement('div');
  elCellGroup.style.position = 'relative';
  elCellGroup.classList.add('cell-group');

  draggableObjects.push(new DraggableCellGroup(elCellGroup, ship));

  ship.relativeCoords.forEach(([x, y]) => {
    const elCell = elCellGroup.appendChild(document.createElement('div'));
    elCell.classList.add('cell');
    elCell.classList.add(ship.name);
    elCell.dataset.shipName = ship.name;
    elCell.dataset.x = x;
    elCell.dataset.y = y;
  });
  return elCellGroup;
}

function generateGrid(height = 10, width = 10) {
  const elGrid = document.createElement('div');
  elGrid.classList.add('grid');
  for (let y = 0; y < height; y += 1) {
    const elRow = elGrid.appendChild(document.createElement('div'));
    elRow.classList.add('row');
    for (let x = 0; x < width; x += 1) {
      const elCell = elRow.appendChild(document.createElement('div'));
      elCell.classList.add('cell');
      elCell.dataset.y = y;
      elCell.dataset.x = x;
      gridCells.push(elCell);
    }
  }
  return elGrid;
}

function displaySetShips(playerObject) {
  clearElementChildren(elContainer);

  // todo:
  // show modal with player name saying who has to place ships
  // after user agreement, let them place ships with drag & drop
  const elSetShipsDiv = elContainer.appendChild(document.createElement('div'));
  elSetShipsDiv.classList.add('set-ships-wrapper');

  const elShipStorage = elSetShipsDiv.appendChild(document.createElement('div'));
  elShipStorage.classList.add('ship-storage');
  shipTypes.forEach((ship) => {
    elShipStorage.appendChild(generateShipCells(ship));
  });

  const elShipGrid = elSetShipsDiv.appendChild(document.createElement('div'));
  elShipGrid.classList.add('place-ships');
  elShipGrid.appendChild(generateGrid(10, 10));
}

function getRandomInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isOverlappingBlacklist(currentCoords, shipOrientation, shipLength, blacklist = []) {
  if (blacklist.length <= 0) return false;
  for (let i = 0; i < blacklist.length; i += 1) {
    const blacklistCoords = blacklist[i];
    for (let j = 0; j < blacklistCoords.length; j += 1) {
      const blacklistSingleCoords = blacklistCoords[j];
      if (
        shipOrientation === 0 // horizontal
        && currentCoords.x <= blacklistSingleCoords.x
        && (currentCoords.x + (shipLength - 1)) >= blacklistSingleCoords.x
        && currentCoords.y === blacklistSingleCoords.y
        || shipOrientation === 1 // vertical
        && currentCoords.y <= blacklistSingleCoords.y
        && (currentCoords.y + (shipLength - 1)) >= blacklistSingleCoords.y
        && currentCoords.x === blacklistSingleCoords.x
      ) {
        return true;
      }
    }
  }
  return false;
}

function getRandomCoordinates(shipLength, blacklist) {
  let newCoords;
  let shipOrientation;
  do {
    // 0 = horizontal | 1 = vertical
    shipOrientation = getRandomInclusive(0, 1);
    if (shipOrientation === 0) {
      // horizontal
      newCoords = { x: getRandomInclusive(0, 9 - shipLength + 1), y: getRandomInclusive(0, 9) };
    } else {
      // vertical
      newCoords = { x: getRandomInclusive(0, 9), y: getRandomInclusive(0, 9 - shipLength + 1) };
    }
  } while (isOverlappingBlacklist(newCoords, shipOrientation, shipLength, blacklist));

  const coordArray = [];
  coordArray.push(newCoords);
  // shipLength - 1 for having starting string
  for (let i = 0; i < shipLength - 1; i += 1) {
    const lastValue = coordArray[coordArray.length - 1];
    if (shipOrientation === 0) {
      // horizontal
      coordArray.push({ x: lastValue.x + 1, y: lastValue.y });
    } else {
      // vertical
      coordArray.push({ x: lastValue.x, y: lastValue.y + 1 });
    }
  }
  return coordArray;
}

function getPureRandomShipArray(ships) {
  const shipCoordinates = [];
  for (let i = 0; i < ships.length; i += 1) {
    shipCoordinates.push(getRandomCoordinates(ships[i].shipLength, shipCoordinates));
  }
  return shipCoordinates;
}

function setRandomShips(playerObject) {
  const coordinates = getPureRandomShipArray(shipTypes);
  for (let i = 0; i < coordinates.length; i += 1) {
    const shipCoordinates = coordinates[i];
    playerObject.playerBoard.placeShip(shipTypes[i].name, shipCoordinates);
  }
}

function initShipPlacement(playerOne, playerTwo) {
  displaySetShips(playerOne);
  // note to self: comment out past this for dev
  // setRandomShips(playerOne); // temp
  // if (playerTwo.isCpu) {
  //   setRandomShips(playerTwo);
  // } else {
  //   // displaySetShips(playerTwo);
  //   setRandomShips(playerTwo); // temp
  // }

  // console.log(playerOne);
  // console.log(playerTwo);

  // initGame(playerOne, playerTwo);
}

export { initShipPlacement, getPureRandomShipArray, shipTypes };
