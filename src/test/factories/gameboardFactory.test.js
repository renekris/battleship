import { default as gameBoardFactory } from '../../js/factories/gameboardFactory';

describe('Gameboard factory', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = gameBoardFactory();
  });

  it('gameboard.placeShip()', () => {
    expect(gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }])).toHaveLength(2);
    expect(gameboard.placeShip('battleship', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }, { 'x': 2, 'y': 0 }, { 'x': 3, 'y': 0 }])).toHaveLength(4);
  });

  it('gameboard.receiveAttack()', () => {
    gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    expect(gameboard.receiveAttack({ 'x': 0, 'y': 0 })).toBe(true);
    expect(gameboard.receiveAttack({ 'x': 1, 'y': 0 })).toBe(true);
  });

  it('gameboard.receiveAttack() overflow', () => {
    gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    expect(gameboard.receiveAttack({ 'x': 0, 'y': 0 })).toBe(true);
    expect(gameboard.receiveAttack({ 'x': 0, 'y': 0 })).toBe(false);
  })

  it('gameboard.areShipsSunk()', () => {
    expect(gameboard.areShipsSunk()).toBe(false);
    gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    gameboard.receiveAttack({ 'x': 0, 'y': 0 });
    expect(gameboard.areShipsSunk()).toBe(false);
    gameboard.receiveAttack({ 'x': 1, 'y': 0 });
    expect(gameboard.areShipsSunk()).toBe(true);
  });
});
