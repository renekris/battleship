import gameBoardFactory from "./gameboard-factory";

function playerFactory(username, isCpu = false) {
  const playerBoard = gameBoardFactory();
  const referenceBoard = gameBoardFactory();

  return {
    username,
    isCpu,
    playerBoard,
    referenceBoard,
  }
}

export default playerFactory;
