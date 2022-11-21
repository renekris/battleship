import { default as playerFactory } from '../../js/factories/playerFactory';

describe('Player factory', () => {
  const playerName = 'Renekris';
  let player;
  let computer;

  beforeEach(() => {
    player = playerFactory(playerName);
    computer = playerFactory('Computer', true);
  });

  it('setForeignBoard(), test connected status', () => {
    expect(player.foreignBoard()).toBe(false);

    player.setForeignBoard(computer.playerBoard());
    computer.setForeignBoard(player.playerBoard());

    player.foreignBoard().placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    expect(computer.playerBoard().areShipsSunk()).toBe(false);
    player.foreignBoard().receiveAttack({ 'x': 0, 'y': 0 });
    player.foreignBoard().receiveAttack({ 'x': 1, 'y': 0 });


    expect(computer.foreignBoard()).toEqual(player.playerBoard());
    expect(computer.playerBoard().areShipsSunk()).toBe(true);
  });

  it('username', () => {
    expect(player.username).toBe(playerName);
  });

  it('isCpu', () => {
    expect(player.isCpu).toBe(false);
    expect(computer.isCpu).toBe(true);
  });
});
