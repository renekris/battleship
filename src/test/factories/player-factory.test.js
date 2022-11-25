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

  it('attackEnemy() + hitStatus', () => {
    const shipCoords = [{ x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }];
    let hitStatus = null;
    computer.playerBoard.placeShip('destroyer', shipCoords);
    shipCoords.forEach((coords) => {
      hitStatus = player.attackEnemy(coords);
      expect(hitStatus).toBe(true);
    });
    expect(player.attackEnemy({ x: 0, y: 0 })).toBe(false);
    expect(player.attackEnemy({ x: 1, y: 0 })).toBe(false);

    computer.playerBoard.receivedShotsMap.forEach((value) => {
      if (value !== null) {
        expect(value).toBeInstanceOf(Object);
      }
    });
  });

  it('username', () => {
    expect(player.username).toBe(playerName);
  });

  it('isCpu', () => {
    expect(player.isCpu).toBe(false);
    expect(computer.isCpu).toBe(true);
  });
});
