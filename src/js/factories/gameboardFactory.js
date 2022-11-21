import shipFactory from "./shipFactory";

function gameBoardFactory(width = 10, height = 10) {
  const board = new Map();
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      board.set({ x, y }, null);
    }
  }

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
  const locationsShot = new Set();

  function boardFind({ x, y } = coord, callback = null) {
    board.forEach((value, key) => {
      if (key.x === x && key.y === y) {
        callback(value, key);
      }
    });
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
    if (locationsShot.has(JSON.stringify(coord))) {
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

    locationsShot.add(JSON.stringify(coord));
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
    return locationsShot;
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
    locationsShot,
    canAttack,
    tileType,
    placeShip,
    receiveAttack,
    areShipsSunk,
  }
}

export default gameBoardFactory;
