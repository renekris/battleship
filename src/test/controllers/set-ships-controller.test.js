import { getRandomCoordinates } from "../../js/controllers/set-ships-controller";


describe('set-ships-controller', () => {
  it('getRandomCoordinates() no overflow', () => {
    let highest = false;
    for (let i = 1; i < 500; i += 1) {
      const result = getRandomCoordinates(5);
      if (result[result.length - 1].x > result[result.length - 2].x && result[result.length - 1].x === 9) {
        highest = true;
        break;
      }
      if (result[result.length - 1].y > result[result.length - 2].y && result[result.length - 1].y === 9) {
        highest = true;
        break;
      }
    }
    expect(highest).toBe(true);
  });
});
