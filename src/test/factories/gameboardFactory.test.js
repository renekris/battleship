import { default as gameBoardFactory } from '../../js/factories/gameboardFactory';

describe('Gameboard factory', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = gameBoardFactory();
  });

  it('gameboard.placeShip()', () => {
    expect(gameboard.placeShip('destroyer', [[0, 0], [0, 1]])).toHaveLength(2);
    expect(gameboard.placeShip('battleship', [[0, 0], [0, 1], [0, 2], [0, 3]])).toHaveLength(4);
  });
});
