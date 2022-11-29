import shipFactory from "./ship-factory";

function gameBoardFactory(width = 10, height = 10) {
  const board = new Map();
  const ships = [];
  const receivedShots = new Set();
  const receivedShotsMap = new Map();
  // undamagedTiles is the inverse of receivedShots
  const undamagedTiles = new Set();

  (function init() {
    for (let y = 0; y < width; y += 1) {
      for (let x = 0; x < height; x += 1) {
        board.set({ x, y }, null);
      }
    }
    board.forEach((value, key) => {
      // eslint-disable-next-line no-use-before-define
      if (!setHas(receivedShots, key)) {
        undamagedTiles.add(key);
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

  function boardSetShipObject({ x, y }, shipObject) {
    boardFind({ x, y }, (value, key) => {
      board.set(key, shipObject);
    });
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

  function getAiMove() {
    const randomIndex = getRandomInclusive(0, undamagedTiles.size - 1);
    let randomUndamagedTile = null;
    let count = 0;
    undamagedTiles.forEach(value => {
      if (count === randomIndex) {
        randomUndamagedTile = value;
      }
      count += 1;
    });
    return randomUndamagedTile;
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

  function placeShip(shipName, coords = [{ x: 0, y: 0 }]) {
    const newShip = shipFactory(shipName, coords.length);
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
    undamagedTiles.delete(coords);
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
    board.forEach((ship) => {
      if (ship !== null) {
        shipTileCount += 1;
        if (ship.isSunk()) {
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
    undamagedTiles,
    boardSetShipObject,
    getAiMove,
    canAttack,
    tileType,
    placeShip,
    receiveAttack,
    areShipsSunk,
  }
}

export default gameBoardFactory;
