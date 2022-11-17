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

  return {
    board,
    placeShip: (shipType, coords = [{ x: 0, y: 0 }, { x: 0, y: 1 }]) => {
      if (coords.length > shipTypes[shipType].length) {
        throw new Error('More coords than ship\'s length');
      }

      const newShip = shipFactory(shipTypes[shipType].length);
      const shipTiles = [];
      ships.push(newShip);
      coords.forEach(coord => {
        board.forEach((value, key) => {
          if (key.x === coord.x && key.y === coord.y) {
            board.set(key, newShip);
          }
        });
        shipTiles.push(board.get(coord));
      });

      return shipTiles;
    },
    receiveAttack: (coord = { x: 0, y: 0 }) => {
      if (locationsShot.has(JSON.stringify(coord))) {
        return false;
      }

      let target;
      board.forEach((value, key) => {
        if (key.x === coord.x && key.y === coord.y) {
          target = value;
        }
      });

      if (target !== null) {
        if (!target.isSunk()) {
          target.hit();
          locationsShot.add(JSON.stringify(coord));
          return true;
        }
      }
      return locationsShot;
    }
  }
}

export default gameBoardFactory;
