import playerFactory from "../factories/player-factory";

function displaySetShips() {

}

function getRandomInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// implement coord blacklist to avoid overwriting
function getRandomCoordinates(shipLength) {
  // 0 = horizontal | 1 = vertical
  const shipOrientation = getRandomInclusive(0, 1);
  const coordArray = [];

  if (shipOrientation === 0) {
    // horizontal
    coordArray.push({ x: getRandomInclusive(0, 9 - shipLength + 1), y: getRandomInclusive(0, 9) });
  } else {
    // vertical
    coordArray.push({ x: getRandomInclusive(0, 9), y: getRandomInclusive(0, 9 - shipLength + 1) });
  }

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

function initShipPlacement(playerOne = playerFactory(), playerTwo = playerFactory()) {
  // temp
  playerOne.playerBoard.placeShip('carrier', getRandomCoordinates(5));
  console.log(playerOne.playerBoard);
}

export { initShipPlacement, getRandomCoordinates };
