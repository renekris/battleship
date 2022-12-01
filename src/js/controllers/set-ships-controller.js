import { clearElementChildren, initGame } from "./game-controller";

// DOM CACHE
const elContainer = document.getElementById('container');

// VARIABLES
const shipTypes = [
  {
    name: 'carrier',
    shipLength: 5
  },
  {
    name: 'battleship',
    shipLength: 4
  },
  {
    name: 'cruiser',
    shipLength: 3
  },
  {
    name: 'submarine',
    shipLength: 3
  },
  {
    name: 'destroyer',
    shipLength: 2
  },
];

function generateShipCells(ship, height = 1, width = 1) {
  const elCellGroup = document.createElement('div');
  elCellGroup.classList.add('cell-group');

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const elCell = elCellGroup.appendChild(document.createElement('div'));
      elCell.classList.add('cell');
      elCell.classList.add(ship.name);
      elCell.dataset.y = y;
      elCell.dataset.x = x;
    }
  }
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
    // default ship direction is vertical
    elShipStorage.appendChild(generateShipCells(ship, ship.shipLength, 1));
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
  // displaySetShips(playerOne);
  // note to self: comment out past this for dev
  setRandomShips(playerOne); // temp
  if (playerTwo.isCpu) {
    setRandomShips(playerTwo);
  } else {
    // displaySetShips(playerTwo);
    setRandomShips(playerTwo); // temp
  }

  console.log(playerOne);
  console.log(playerTwo);

  initGame(playerOne, playerTwo);
}

export { initShipPlacement, getPureRandomShipArray, shipTypes };
