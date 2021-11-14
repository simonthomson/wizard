import { CardTypes } from './constants';
import GameException from './game-exception';

class Card {
  constructor(type, suit = undefined, rank = undefined) {
    if (!Object.values(CardTypes).some(cardType => cardType === type)) {
      throw new GameException(`Tried to create a card of type ${type}, but ${type} is not a valid card type.`);
    }
    this.type = type;
    if (this.type === CardTypes.Value) {
      if (!suit) {
        throw new GameException(`Tried to create card of type ${type}, but no suit was given.`);
      }
      if (!rank) {
        throw new GameException(`Tried to create card of type ${type}, but no rank was given.`);
      }
      this.suit = suit;
      this.rank = rank;
    }
  }
}

export default Card;
