function shipFactory(shipName, length) {
  let hits = 0;

  function hit(amount = 1) {
    hits += amount;
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
    hit,
    isSunk,
  }
}

export default shipFactory;
