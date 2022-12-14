import shipFactory from "./ship-factory";

function gameBoardFactory(width = 10, height = 10) {
  const board = new Map();
  const ships = [];
  const receivedShots = new Set();
  const receivedShotsInverse = new Set();
  const receivedShotsMap = new Map();

  (function init() {
    for (let y = 0; y < width; y += 1) {
      for (let x = 0; x < height; x += 1) {
        board.set({ x, y }, null);
      }
    }
    board.forEach((value, key) => {
      // eslint-disable-next-line no-use-before-define
      if (!setHas(receivedShots, key)) {
        receivedShotsInverse.add(key);
      }
    });
  })();

  function boardFind({ x, y }, callback) {
    board.forEach((value, key) => {
      // eslint-disable-next-line eqeqeq
      if (key.x == x && key.y == y) {
        callback(value, key);
      }
    });
  }

  function boardFindValue({ x, y }) {
    let value = null;
    boardFind({ x, y }, (foundValue) => {
      value = foundValue;
    });
    return value;
  }

  function getRandomInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setHas(set, { x, y }) {
    let result = false;
    set.forEach(value => {
      if (value.x === x && value.y === y) {
        result = true;
      }
    });
    return result;
  }

  function getNewRandomCoords() {
    const randomIndex = getRandomInclusive(0, receivedShotsInverse.size - 1);
    let randomUndamagedTile = null;
    let count = 0;
    receivedShotsInverse.forEach(value => {
      if (count === randomIndex) {
        randomUndamagedTile = value;
      }
      count += 1;
    });
    return randomUndamagedTile;
  }

  function isMovePossible(coords) {
    return setHas(receivedShotsInverse, coords);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getAiMove(shipTargetCoordsArray = null) {
    if (shipTargetCoordsArray.length <= 0 || shipTargetCoordsArray === null) {
      return getNewRandomCoords();
    }

    let newCoords = null;
    for (let i = 0; i < shipTargetCoordsArray.length; i += 1) {
      if (!shipTargetCoordsArray[i].isSunk()) {
        const { x, y } = shipTargetCoordsArray[i].coords;
        // all relative positions in the shape of (+) except {x: 0, y: 0}
        const relativeCoords = [
          { x: x - 1, y },
          { x, y: y + 1 },
          { x: x + 1, y },
          { x, y: y - 1 },
        ];

        shuffleArray(relativeCoords);

        // eslint-disable-next-line no-loop-func
        relativeCoords.forEach((relativeCoord) => {
          if (isMovePossible(relativeCoord)) {
            newCoords = relativeCoord;
          }
        });
      }
    }
    return newCoords ?? getNewRandomCoords();
  }

  function tileType(coords) {
    let result = null;
    boardFind(coords, (value) => {
      if (value !== null) {
        result = 'empty';
      } else {
        result = 'ship';
      }
    });
    return result;
  }

  function canAttack(coords) {
    if (setHas(receivedShots, coords)) {
      return false;
    }
    return true;
  }

  function placeShip(shipName, coords = [{ x: 0, y: 0 }, { x: 0, y: 1 }]) {
    const newShip = shipFactory(shipName, coords.length, coords);
    const shipTiles = [];
    ships.push(newShip);
    coords.forEach(coord => {
      boardFind(coord, (value, key) => {
        board.set(key, newShip);
      });
      shipTiles.push(board.get(coord));
    });

    return shipTiles;
  }

  function damageShip(shipObject) {
    if (shipObject !== null) {
      if (!shipObject.isSunk()) {
        shipObject.hit();
      }
    }
  }

  function updateReceivedShots(coords, shipObject) {
    receivedShots.add(coords);
    receivedShotsInverse.forEach((value) => {
      if (value.x === coords.x && value.y === coords.y) {
        receivedShotsInverse.delete(value);
      }
    });
    receivedShotsMap.set(coords, shipObject);
  }

  function receiveAttack(coords = { x: 0, y: 0 }) {
    if (!canAttack(coords)) {
      return null;
    }
    let target = null;
    boardFind(coords, (value) => {
      if (value !== null) {
        target = value;
      }
    });

    updateReceivedShots(coords, target);
    damageShip(target);
    return target;
  }

  function areShipsSunk() {
    let shipTileCount = 0;
    let shipSinkTileCount = 0;
    board.forEach((cell) => {
      if (cell !== null) {
        shipTileCount += 1;
        if (cell.isSunk()) {
          shipSinkTileCount += 1;
        }
      }
    });
    if (shipTileCount > 0 && shipSinkTileCount > 0 && shipSinkTileCount >= shipTileCount) {
      return true;
    }
    return false;
  }

  return {
    board,
    receivedShots,
    receivedShotsMap,
    receivedShotsInverse,
    boardFindValue,
    getAiMove,
    tileType,
    placeShip,
    receiveAttack,
    areShipsSunk,
  }
}

export default gameBoardFactory;
