import gameBoardFactory from "./gameboard-factory";

function playerFactory(username, isCpu = false) {
  const playerBoard = gameBoardFactory();
  const referenceBoard = gameBoardFactory();

  function getRandomAttack() {
    const randomUndamagedTile = referenceBoard.boardUndamagedRandom();
    return randomUndamagedTile;
  }

  function attackEnemy(enemyBoard, { x, y } = {}) {
    const attackLocation = isCpu ? getRandomAttack() : { x, y };
    enemyBoard.receiveAttack(attackLocation);
    referenceBoard.receiveAttack(attackLocation);
    return attackLocation;
  }

  return {
    username,
    isCpu,
    playerBoard,
    referenceBoard,
    attackEnemy,
  }
}

export default playerFactory;
