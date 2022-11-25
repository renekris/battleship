import gameBoardFactory from "./gameboard-factory";

function playerFactory(username, isCpu = false) {
  const playerBoard = gameBoardFactory();
  const referenceBoard = gameBoardFactory();
  let enemy = null;

  function getRandomAttack() {
    const randomUndamagedTile = referenceBoard.boardUndamagedRandom();
    return randomUndamagedTile;
  }

  function attackEnemy({ x, y }) {
    if (enemy === null) {
      throw new Error('Enemy is not set for player: ', this);
    }

    const attackLocation = isCpu ? getRandomAttack() : { x, y };
    referenceBoard.receiveAttack(attackLocation);
    const hitStatus = enemy.playerBoard.receiveAttack(attackLocation);

    return hitStatus;
  }

  function setEnemy(playerObject) {
    enemy = playerObject;
    return enemy;
  }

  return {
    username,
    isCpu,
    playerBoard,
    referenceBoard,
    attackEnemy,
    setEnemy,
  }
}

export default playerFactory;
