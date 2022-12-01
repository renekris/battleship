function shipFactory(shipName, length, shipCoordinates) {
  let hits = 0;

  function hit(damageAmount = 1) {
    hits += damageAmount;
    return hits;
  }

  function isSunk() {
    if (hits >= length) {
      return true;
    }
    return false;
  }

  return {
    shipName,
    length,
    shipCoordinates,
    hit,
    isSunk,
  }
}

export default shipFactory;
