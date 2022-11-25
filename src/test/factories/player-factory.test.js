import { default as playerFactory } from '../../js/factories/player-factory';

describe('Player factory', () => {
  const playerName = 'Renekris';
  let player;
  let computer;

  beforeEach(() => {
    player = playerFactory(playerName);
    computer = playerFactory('Computer', true);
    player.setEnemy(computer);
    computer.setEnemy(player);
  });

  it('attackEnemy() + receivedShots', () => {
    player.playerBoard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);
    computer.playerBoard.placeShip('destroyer', [{ 'x': 2, 'y': 5 }, { 'x': 2, 'y': 6 }]);
    player.attackEnemy({ 'x': 0, 'y': 0 });
    const randomAttack = computer.attackEnemy(player.playerBoard);

    expect(computer.playerBoard.receivedShots).toContainEqual({ 'x': 0, 'y': 0 });
    expect(player.playerBoard.receivedShots).toContainEqual(randomAttack);
  });

  it('username', () => {
    expect(player.username).toBe(playerName);
  });

  it('isCpu', () => {
    expect(player.isCpu).toBe(false);
    expect(computer.isCpu).toBe(true);
  });
});
