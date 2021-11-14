class GameException {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export default GameException;
