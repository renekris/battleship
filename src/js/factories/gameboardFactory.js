import shipFactory from "./shipFactory";

function gameBoardFactory(width = 2, height = 2) {
  const board = new Map();
  const shipTypes = {
    'carrier': {
      name: 'carrier',
      length: 5
    },
    'battleship': {
      name: 'battleship',
      length: 4
    },
    'cruiser': {
      name: 'cruiser',
      length: 3
    },
    'submarine': {
      name: 'submarine',
      length: 3
    },
    'destroyer': {
      name: 'destroyer',
      length: 2
    },
  }
  const ships = [];
  const receivedShots = new Set();
  // undamagedTiles is the inverse of receivedShots
  const undamagedTiles = new Set();

  (function init() {
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
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

  function boardFind({ x, y }, callback = null) {
    board.forEach((value, key) => {
      if (key.x === x && key.y === y) {
        callback(value, key);
      }
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

  function boardUndamagedRandom() {
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

  function tileType(x, y) {
    let result = null;
    boardFind({ x, y }, (value) => {
      if (value !== null) {
        result = 'empty';
      } else {
        result = 'ship';
      }
    });
    return result;
  }

  function canAttack(coord) {
    if (setHas(receivedShots, coord)) {
      return false;
    }
    return true;
  }

  function placeShip(shipType, coords = [{ x: 0, y: 0 }, { x: 0, y: 1 }]) {
    if (coords.length > shipTypes[shipType].length) {
      throw new Error('More coords than ship\'s length');
    }

    const newShip = shipFactory(shipTypes[shipType].length);
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

  function receiveAttack(coord = { x: 0, y: 0 }) {
    if (!canAttack(coord)) {
      return false;
    }

    receivedShots.add(coord);
    undamagedTiles.delete(coord);
    let target;
    boardFind(coord, (value) => {
      target = value;
    });
    if (target !== null) {
      if (!target.isSunk()) {
        target.hit();
        return true;
      }
    }
    return receivedShots;
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
    boardUndamagedRandom,
    canAttack,
    tileType,
    placeShip,
    receiveAttack,
    areShipsSunk,
  }
}

export default gameBoardFactory;
