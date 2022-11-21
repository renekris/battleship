import gameBoardFactory from "./gameboardFactory";

function playerFactory(username, isCpu = false) {
  const playerBoard = gameBoardFactory();
  const referenceBoard = gameBoardFactory();

  function getRandomNumberBetweenInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomAttack() {
    const x = getRandomNumberBetweenInclusive(0, 9);
    const y = getRandomNumberBetweenInclusive(0, 9);
    return { x, y };
  }

  return {
    username,
    isCpu,
    playerBoard,
    referenceBoard,
    attackEnemy: (enemyBoard, { x, y } = coord) => {
      const attackLocation = isCpu ? getRandomAttack() : { x, y };
      enemyBoard.receiveAttack(attackLocation);
      referenceBoard.receiveAttack(attackLocation);
      return attackLocation;
    }
  }
}

export default playerFactory;
