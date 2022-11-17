function shipFactory(length) {
  let hits = 0;

  return {
    length,
    hit: (amount = 1) => {
      hits += amount;
      return hits;
    },
    isSunk: () => {
      if (hits >= length) {
        return true;
      }
      return false;
    }
  }
}

export default shipFactory;
