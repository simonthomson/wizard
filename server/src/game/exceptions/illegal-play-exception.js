import { default as GameException } from './game-exception';

class IllegalPlayException extends GameException{
  constructor(message) {
    super(message);
  }
}

export default IllegalPlayException;
