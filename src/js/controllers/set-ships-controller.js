import playerFactory from "../factories/player-factory";

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

function displaySetShips() {
  // todo:
  // show modal with player name saying who has to place ships
  // after user agreement, let them place ships with drag & drop
}

function getRandomInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isOverlappingBlacklist(currentCoords, shipOrientation, shipLength, blacklist = []) {
  if (blacklist.length <= 0) return false;
  for (let i = 0; i < blacklist.length; i += 1) {
    const blacklistCoords = blacklist[i];
    for (let j = 0; j < blacklistCoords.length; j += 1) {
      const singleCoords = blacklistCoords[j];
      if (
        shipOrientation === 0 // horizontal
        && currentCoords.x < singleCoords.x
        && (currentCoords.x + (shipLength - 1)) > singleCoords.x
        && currentCoords.y === singleCoords.y
        || shipOrientation === 1 // vertical
        && currentCoords.y < singleCoords.y
        && (currentCoords.y + (shipLength - 1)) > singleCoords.y
        && currentCoords.x === singleCoords.x
      ) {
        console.log('New coords overlapped');
        return true;
      }
    }
  }
  return false;
}

// implement coord blacklist to avoid overwriting
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

function initShipPlacement(playerOne = playerFactory(), playerTwo = playerFactory()) {
  // displaySetShips(playerOne);
  setRandomShips(playerOne); // temp
  if (playerTwo.isCpu) {
    setRandomShips(playerTwo);
  } else {
    // displaySetShips(playerTwo);
    setRandomShips(playerTwo); // temp
  }

  console.log(playerOne);
  console.log(playerTwo);
}

export { initShipPlacement, getRandomCoordinates };
