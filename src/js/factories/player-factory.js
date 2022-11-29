import gameBoardFactory from "./gameboard-factory";

function playerFactory(username, isCpu = false) {
  const playerBoard = gameBoardFactory();
  const referenceBoard = gameBoardFactory();

  function getRandomAttack() {
    const randomUndamagedTile = referenceBoard.boardUndamagedRandom();
    return randomUndamagedTile;
  }

  return {
    username,
    isCpu,
    playerBoard,
    referenceBoard,
    getRandomAttack
  }
}

export default playerFactory;
