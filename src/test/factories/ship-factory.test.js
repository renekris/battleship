import { default as shipFactory } from '../../js/factories/ship-factory';

describe('Ship factory function', () => {
  let ship;
  beforeEach(() => {
    ship = shipFactory('carrier', 5);
  });

  it('ship.length', () => {
    expect(ship.length).toEqual(5);
  });

  it('ship.hit()', () => {
    expect(ship.hit()).toBe(1);
  });

  it('ship.isSunk()', () => {
    expect(ship.isSunk()).toBe(false);
    expect(ship.hit(5)).toBe(5);
    expect(ship.isSunk()).toBe(true);
  })

});
