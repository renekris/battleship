import playerFactory from "../factories/player-factory";

function displaySetShips() {

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

function setAiShips(playerObj) {
  const shipLengths = [5, 4, 3, 3, 2];
  const shipCoordinates = [];
  for (let i = 0; i < 5; i += 1) {
    shipCoordinates.push(getRandomCoordinates(shipLengths[i], shipCoordinates));
  }

  console.log(shipCoordinates);

  shipCoordinates.forEach((coords) => {
    // playerObj.playerBoard.placeShip()
  });
}

function initShipPlacement(playerOne = playerFactory(), playerTwo = playerFactory()) {
  // temp
  playerOne.playerBoard.placeShip('carrier', getRandomCoordinates(5));
  console.log(getRandomCoordinates(5));
  console.log(playerOne.playerBoard);
  setAiShips(playerTwo);
}

export { initShipPlacement, getRandomCoordinates };
