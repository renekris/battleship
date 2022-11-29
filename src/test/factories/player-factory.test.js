import { default as playerFactory } from '../../js/factories/player-factory';

describe('Player factory', () => {
  const playerName = 'Renekris';
  let player;
  let computer;

  beforeEach(() => {
    player = playerFactory(playerName);
    computer = playerFactory('Computer', true);
  });

  it('username', () => {
    expect(player.username).toBe(playerName);
  });

  it('isCpu', () => {
    expect(player.isCpu).toBe(false);
    expect(computer.isCpu).toBe(true);
  });
});
