import gameBoardFactory from "./gameboardFactory";

function playerFactory(username, isCpu = false) {
  let playerBoard;
  let foreignBoard;

  return {
    username,
    isCpu,
    playerBoard: () => {
      if (!playerBoard) {
        playerBoard = gameBoardFactory();
      }
      return playerBoard
    },
    foreignBoard: () => {
      if (!foreignBoard) {
        return false;
      }
      return foreignBoard;
    },
    setForeignBoard: (board) => {
      foreignBoard = board;
      return foreignBoard;
    }
  }
}

export default playerFactory;
