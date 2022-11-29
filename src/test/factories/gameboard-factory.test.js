import { default as gameBoardFactory } from '../../js/factories/gameboard-factory';

describe('Gameboard factory', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = gameBoardFactory();
  });

  it('gameboard.placeShip()', () => {
    expect(gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }])).toHaveLength(2);
    expect(gameboard.placeShip('battleship', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }, { 'x': 2, 'y': 0 }, { 'x': 3, 'y': 0 }])).toHaveLength(4);
  });

  it('gameboard.receiveAttack() + shipObject', () => {
    gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    const shipObject = gameboard.receiveAttack({ 'x': 0, 'y': 0 });
    expect(gameboard.receiveAttack({ 'x': 1, 'y': 0 })).toBe(shipObject);
  });

  it('gameboard.areShipsSunk()', () => {
    expect(gameboard.areShipsSunk()).toBe(false);
    gameboard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    gameboard.receiveAttack({ 'x': 0, 'y': 0 });
    expect(gameboard.areShipsSunk()).toBe(false);
    gameboard.receiveAttack({ 'x': 1, 'y': 0 });
    expect(gameboard.areShipsSunk()).toBe(true);
  });
});
