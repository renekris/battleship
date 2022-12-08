import { clearElementChildren, initGame } from "./game-controller";

// DOM CACHE
const elContainer = document.getElementById('container');
let elContinueButton;

// VARIABLES
const baseShipTypes = [
  {
    name: 'carrier',
    shipLength: 5,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    orientation: 'vertical',
  },
  {
    name: 'battleship',
    shipLength: 4,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    orientation: 'vertical',
  },
  {
    name: 'cruiser',
    shipLength: 3,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    orientation: 'vertical',
  },
  {
    name: 'submarine',
    shipLength: 3,
    relativeCoords: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    orientation: 'vertical',
  },
  {
    name: 'destroyer',
    shipLength: 2,
    relativeCoords: [
      [0, 0],
      [0, 1],
    ],
    orientation: 'vertical',
  },
];
let shipTypes = baseShipTypes;
let draggableObjects = [];
let gridCells = [];
let placedShips = [];
let elPlaceShipGrid = null;
let playerOneTurn = true;
class DraggableCellGroup {
  constructor(element, shipType) {
    this.isDragging = false;
    this.elGroupActiveCell = null;
    this.elCellGroup = element;
    this.shipObj = shipType;
    this.offsetX = 0;
    this.offsetY = 0;
    this.elHoveredOnCell = null;
    this.hoveredCoords = null;

    this.elCellGroup.addEventListener('pointerdown', (e) => this.dragStart(e), false);
    this.elCellGroup.addEventListener('pointerup', (e) => this.dragEnd(e), false);
    elContainer.addEventListener('pointermove', (e) => this.dragMove(e), false);
  }

  resetElementPosition() {
    setTranslate(0, 0, this.elCellGroup);
    [this.offsetX, this.offsetY] = [0, 0];
  }

  setElementPositionToCenter(shipCoordinates) {
    this.resetElementPosition();
    const gridCoordCells = findGridCells(shipCoordinates);
    const cellGroup = {
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
      left: Number.POSITIVE_INFINITY,
    };
    gridCoordCells.forEach((elCell) => {
      const rect = elCell.getBoundingClientRect();
      cellGroup.top = rect.top < cellGroup.top ? rect.top : cellGroup.top;
      cellGroup.right = rect.right > cellGroup.right ? rect.right : cellGroup.right;
      cellGroup.bottom = rect.bottom > cellGroup.bottom ? rect.bottom : cellGroup.bottom;
      cellGroup.left = rect.left < cellGroup.left ? rect.left : cellGroup.left;
    });
    cellGroup.width = cellGroup.right - cellGroup.left;
    cellGroup.height = cellGroup.bottom - cellGroup.top;
    const rectGroup = this.elCellGroup.getBoundingClientRect();
    const coords = [
      ((cellGroup.width - rectGroup.width) / 2) + cellGroup.left - rectGroup.left,
      ((cellGroup.height - rectGroup.height) / 2) + cellGroup.top - rectGroup.top
    ];
    setTranslate(coords[0], coords[1], this.elCellGroup);
    [this.offsetX, this.offsetY] = coords;
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
      if (mouseOverlap(e, elPlaceShipGrid)) {
        const elHoveredOnCell = gridCells.filter((elCell) => mouseOverlap(e, elCell))[0];
        if (elHoveredOnCell !== this.elHoveredOnCell) {
          this.elHoveredOnCell = elHoveredOnCell;

          updateHoveredGridCells(this.hoveredCoords, this.shipObj.name, true);
          const hoveredCoords = getDroppedOnCoords(this, elHoveredOnCell);
          this.hoveredCoords = hoveredCoords;
          updateHoveredGridCells(hoveredCoords, this.shipObj.name, false);
        }
      }
    }
  }

  dragEnd(e) {
    this.isDragging = false;

    updateHoveredGridCells(this.hoveredCoords, this.shipObj.name, true);
    if (!mouseOverlap(e, elPlaceShipGrid)) {
      this.resetElementPosition();
      if (resetPlacedShip(this.shipObj.name)) {
        reDrawGridCells();
      }
      return;
    }

    const elDroppedOnCell = gridCells.filter((elCell) => mouseOverlap(e, elCell))[0];
    const droppedOnCoords = getDroppedOnCoords(this, elDroppedOnCell);
    updateGridWithDrop(this, droppedOnCoords);

    this.initialX = this.currentX;
    this.initialY = this.currentY;
    console.log(draggableObjects);
    if (placedShips.length >= 5) {
      elContinueButton.disabled = false;
    } else {
      elContinueButton.disabled = true;
    }
  }
}

function resetVariableData() {
  draggableObjects = [];
  gridCells = [];
  placedShips = [];
  elPlaceShipGrid = null;
  shipTypes = baseShipTypes;
}

function randomizeShipTypes() {
  for (let i = 0; i < shipTypes.length; i += 1) {
    const ship = shipTypes[i];
    const shipDirection = getRandomInclusive(0, 1);
    // 0 = vertical || 1 = horizontal
    if (shipDirection === 1) {
      ship.relativeCoords = ship.relativeCoords.map((coords) => [coords[1], coords[0]]);
      ship.orientation = 'horizontal';
    }
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

function findGridCells(coordsArray) {
  const gridCellsArray = [];
  for (let i = 0; i < coordsArray.length; i += 1) {
    const coord = coordsArray[i];
    for (let j = 0; j < gridCells.length; j += 1) {
      const elCell = gridCells[j];
      // eslint-disable-next-line eqeqeq
      if (elCell.dataset.x == coord[0] && elCell.dataset.y == coord[1]) {
        gridCellsArray.push(elCell);
        break;
      }
    }
  }
  return gridCellsArray;
}

function updateHoveredGridCells(coords, shipName, canRemovePaint = false) {
  if (coords === null) return;
  const elGridCells = findGridCells(coords);
  elGridCells.forEach((elCell) => {
    if (canRemovePaint) {
      elCell.classList.remove(`hover-${shipName}`);
    } else {
      elCell.classList.add(`hover-${shipName}`);
    }
  });
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

    for (let nCI = 0; nCI < newCoords.length; nCI += 1) {
      const newCoord = newCoords[nCI];
      if (placedShip.shipName === shipName) {
        toRemove.push(placedShip.shipName);
        if (placedShip.coords.some((coord) => coord[0] === newCoord[0] && coord[1] === newCoord[1])) {
          break;
        }
      }

      for (let pSI = 0; pSI < placedShip.coords.length; pSI += 1) {
        const placedCoords = placedShip.coords[pSI];
        if (newCoord[0] === placedCoords[0] && newCoord[1] === placedCoords[1]) {
          placedShip.cellGroupObj.resetElementPosition();
          toRemove.push(placedShip.shipName);
          break;
        }
      }
    }
  }
  toRemove.forEach((name) => resetPlacedShip(name, false));
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

function getDroppedOnCoords(cellGroupObj, elDroppedOnCell) {
  const groupRelativeCoords = Array.from(cellGroupObj.elCellGroup.children).map((elCell) => getDatasetCoords(elCell));
  const cellActiveRelCoords = getDatasetCoords(cellGroupObj.elGroupActiveCell);
  const cellDropCoords = getDatasetCoords(elDroppedOnCell);

  const finalCoords = [];
  groupRelativeCoords.forEach((coords) => {
    finalCoords.push([(coords[0] + cellDropCoords[0]) - cellActiveRelCoords[0], (coords[1] + cellDropCoords[1]) - cellActiveRelCoords[1]]);
  });
  return finalCoords;
}

function updateGridWithDrop(cellGroupObj, droppedOnCoords) {
  if (droppedOnCoords.some((coord) => coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9)) {
    resetPlacedShip(cellGroupObj.shipObj.name, false);
    cellGroupObj.resetElementPosition();
  } else {
    resetOverlappingShips(droppedOnCoords, cellGroupObj.shipObj.name);
    placedShips.push({
      shipName: cellGroupObj.shipObj.name,
      coords: droppedOnCoords,
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
  elCellGroup.classList.add(ship.orientation);

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
  elPlaceShipGrid = elGrid;
  return elGrid;
}

function deserializeCoords(array) {
  const newCoordArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const coord = array[i];
    newCoordArray.push([coord.x, coord.y]);
  }
  return newCoordArray;
}

function serializeCoords(array) {
  const newObjectArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const coord = array[i];
    newObjectArray.push({ x: coord[0], y: coord[1] });
  }
  return newObjectArray;
}

function setShips(playerObject) {
  placedShips.forEach((ship) => {
    playerObject.playerBoard.placeShip(ship.shipName, serializeCoords(ship.coords));
  });
}

function clickRandomize() {
  placedShips = [];
  const allShipCoordinates = getPureRandomShipArray(shipTypes);
  for (let i = 0; i < draggableObjects.length; i += 1) {
    const draggableObject = draggableObjects[i];
    const coordinates = deserializeCoords(allShipCoordinates[i]);

    draggableObject.setElementPositionToCenter(coordinates);

    placedShips.push({
      cellGroupObj: draggableObject,
      coords: coordinates,
      shipName: draggableObject.shipObj.name,
    });
  }
  elContinueButton.disabled = false;
  reDrawGridCells();
}

function clickContinue(playerOne, playerTwo) {
  if (placedShips.length < 5) return;
  if (playerOneTurn) {
    setShips(playerOne);
    if (playerTwo.isCpu) {
      setRandomShips(playerTwo, true);
      initGame(playerOne, playerTwo);
    } else {
      playerOneTurn = false;
      resetVariableData();
      displaySetShips(playerOne, playerTwo);
    }
  } else {
    setShips(playerTwo);
    initGame(playerOne, playerTwo);
  }
}

function displaySetShips(playerOne, playerTwo) {
  clearElementChildren(elContainer);

  // todo:
  // show modal with player name saying who has to place ships
  // after user agreement, let them place ships with drag & drop
  const elSetShipsDiv = elContainer.appendChild(document.createElement('div'));
  elSetShipsDiv.classList.add('set-ships-wrapper');

  const elShipStorage = elSetShipsDiv.appendChild(document.createElement('div'));
  elShipStorage.classList.add('ship-storage');

  const elShipStorageHorizontal = elShipStorage.appendChild(document.createElement('div'));
  elShipStorageHorizontal.classList.add('horizontal-ships');
  const elShipStorageVertical = elShipStorage.appendChild(document.createElement('div'));
  elShipStorageVertical.classList.add('vertical-ships');
  randomizeShipTypes();
  shipTypes.forEach((ship) => {
    const shipGroup = generateShipCells(ship);
    if (shipGroup.classList.contains('horizontal')) {
      elShipStorageHorizontal.appendChild(shipGroup);
    } else {
      elShipStorageVertical.appendChild(shipGroup);
    }
  });
  if (elShipStorageVertical.children.length <= 0) {
    elShipStorageVertical.remove();
  } else if (elShipStorageHorizontal.children.length <= 0) {
    elShipStorageHorizontal.remove();
  }


  const elShipGrid = elSetShipsDiv.appendChild(document.createElement('div'));
  elShipGrid.classList.add('place-ships');
  elShipGrid.appendChild(generateGrid(10, 10));

  const elRandomize = elContainer.appendChild(document.createElement('button'));
  elRandomize.addEventListener('click', () => clickRandomize());
  elRandomize.classList.add('randomize-button');
  elRandomize.textContent = 'Randomize';

  const elContinue = elContainer.appendChild(document.createElement('button'));
  elContinue.addEventListener('click', () => clickContinue(playerOne, playerTwo));
  elContinue.classList.add('continue-button');
  elContinue.textContent = 'Continue';
  elContinue.disabled = true;
  elContinueButton = elContinue;
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

function getRandomCoordinates(ship, blacklist, hasRandomOrientation) {
  let newCoords;
  let shipOrientation;
  do {
    // 0 = horizontal | 1 = vertical
    if (hasRandomOrientation) {
      shipOrientation = getRandomInclusive(0, 1);
    } else {
      shipOrientation = ship.orientation === 'horizontal' ? 0 : 1;
    }
    if (shipOrientation === 0) {
      // horizontal
      newCoords = { x: getRandomInclusive(0, 9 - ship.shipLength + 1), y: getRandomInclusive(0, 9) };
    } else {
      // vertical
      newCoords = { x: getRandomInclusive(0, 9), y: getRandomInclusive(0, 9 - ship.shipLength + 1) };
    }
  } while (isOverlappingBlacklist(newCoords, shipOrientation, ship.shipLength, blacklist));

  const coordArray = [];
  coordArray.push(newCoords);
  // ship.shipLength - 1 for having starting string
  for (let i = 0; i < ship.shipLength - 1; i += 1) {
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

function getPureRandomShipArray(ships, hasRandomOrientation) {
  const shipCoordinates = [];
  for (let i = 0; i < ships.length; i += 1) {
    shipCoordinates.push(getRandomCoordinates(ships[i], shipCoordinates, hasRandomOrientation));
  }
  return shipCoordinates;
}

function setRandomShips(playerObject, hasRandomOrientation = true) {
  const coordinates = getPureRandomShipArray(shipTypes, hasRandomOrientation);
  for (let i = 0; i < coordinates.length; i += 1) {
    const shipCoordinates = coordinates[i];
    playerObject.playerBoard.placeShip(shipTypes[i].name, shipCoordinates);
  }
}

function initShipPlacement(playerOne, playerTwo) {
  displaySetShips(playerOne, playerTwo);
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

export { initShipPlacement, getPureRandomShipArray, baseShipTypes };
