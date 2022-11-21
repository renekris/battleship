import { default as playerFactory } from '../../js/factories/playerFactory';

describe('Player factory', () => {
  const playerName = 'Renekris';
  let player;
  let computer;

  beforeEach(() => {
    player = playerFactory(playerName);
    computer = playerFactory('Computer', true);
  });

  it('attackEnemy()', () => {
    player.playerBoard.placeShip('destroyer', [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }]);

    player.attackEnemy(computer.playerBoard, { 'x': 0, 'y': 0 });
    expect(computer.playerBoard.locationsShot).toContainEqual({ 'x': 0, 'y': 0 });
  });

  it('username', () => {
    expect(player.username).toBe(playerName);
  });

  it('isCpu', () => {
    expect(player.isCpu).toBe(false);
    expect(computer.isCpu).toBe(true);
  });
});
