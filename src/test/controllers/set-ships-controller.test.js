/*
 * @jest-environment jsdom
 */

import { getPureRandomShipArray, baseShipTypes } from "../../js/controllers/set-ships-controller";

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

describe('set-ships-controller', () => {
  it('getPureRandomShipArray() x 100. Random ship placement coordinates', () => {
    for (let i = 0; i < 100; i += 1) {
      const shipsArray = getPureRandomShipArray(baseShipTypes);
      const xyStringArray = [];
      shipsArray.forEach((shipCoords) => {
        shipCoords.forEach((shipCoordsSingle) => {
          xyStringArray.push(String(shipCoordsSingle.x) + String(shipCoordsSingle.y));
        })
      });
      expect(hasDuplicates(xyStringArray)).toBe(false);
    }
  });
});
