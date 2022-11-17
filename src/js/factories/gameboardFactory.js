import shipFactory from "./shipFactory";

function gameBoardFactory(width = 10, height = 10) {
  const board = new Map();
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      board.set([x, y], null);
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

  return {
    board,
    placeShip: (shipType, coords = [[0, 0], [0, 1]]) => {
      if (coords.length > shipTypes[shipType].length) {
        throw new Error('More coords than ship\'s length');
      }

      const newShip = shipFactory(shipTypes[shipType].length);
      const shipTiles = [];
      ships.push(newShip);
      coords.forEach(coord => {
        board.set(coord, newShip);
        shipTiles.push(board.get(coord));
      });
      return shipTiles;
    }
  }
}

export default gameBoardFactory;
