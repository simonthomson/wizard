import WizardGame from '../../src/game/wizard-game';
import {countInArray} from '../../../shared/js/util/util';
import { CardTypes } from '../../src/game/constants';
import IllegalPlayException from '../../src/game/exceptions/illegal-play-exception';

describe('WizardGame', () => {

  it('creates a new game', () => {
    let players = ['player-id-1', 'player-id-2'];

    let game = new WizardGame(players);

    expect(game).toBeTruthy();
  });

  describe('constructor', () => {
    it('initializes the game state', () => {
      let players = ['player-id-1', 'player-id-2'];

      let game = new WizardGame(players);

      expect(game.getFullState()).toBeTruthy();
    });

    it('puts wizards in the deck based on how many are requested', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 5;
      let numberOfJesters = 4;

      let game = new WizardGame(players, numberOfWizards, numberOfJesters);

      expect(countInArray(game.getFullState().deck, card => card.type === CardTypes.Wizard)).toEqual(numberOfWizards);
    });

    it('puts jesters in the deck based on how many are requested', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 5;
      let numberOfJesters = 3;

      let game = new WizardGame(players, numberOfWizards, numberOfJesters);

      expect(countInArray(game.getFullState().deck, card => card.type === CardTypes.Jester)).toEqual(numberOfJesters);
    });
  });

  describe('getPublicState', () => {
    it('does not include the exact contents of the deck', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 5;
      let numberOfJesters = 3;

      let game = new WizardGame(players, numberOfWizards, numberOfJesters);

      let publicState = game.getPublicState();

      expect(publicState.deck !== undefined && publicState.deck.some(card => game.suits.some(suit => suit === card.suit))).toBe(false);
    });
  });

  describe('deal', () => {

    it('deals cards to all players based on how many tricks are in the next round to be played', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();

      expect(game.getStateKnownByPlayer(players[0]).hand.length).toEqual(1);
      expect(game.getStateKnownByPlayer(players[1]).hand.length).toEqual(1);
    });
  });

  describe('makeBid', () => {
    it('records the bid in the current game state', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      game.deal();
      game.makeBid(players[0], 0);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(0);
    });

    it('records the bid to the scoreSheet', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      let round = 0;
      game.deal();
      game.makeBid(players[0], 0);
      expect(game.getPublicState().scoreSheet[players[0]][round].bid).toEqual(0);
    });

    it('disallows a bid that would make the bids equal the tricks by the last player to bid', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      let round = 0;
      game.deal();
      game.makeBid(players[0], 1);

      expect(() => game.makeBid(players[1], 0)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[1]]).toEqual(null);
    });

    it('disallows a bid that exceeds the number of tricks in the round', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players, 4, 4, [3, 5]);
  
      let round = 0;
      game.deal();

      expect(() => game.makeBid(players[0], 4)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(null);
    });

    it('disallows a bid from a player who has already bid that round', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      let round = 0;
      game.deal();
      game.makeBid(players[0], 1);

      expect(() => game.makeBid(players[0], 0)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(1);
    });

    it('disallows a bid from a player whos turn it is not', () => {
      let players = ['player-id-1', 'player-id-2', 'player-id-3'];
  
      let game = new WizardGame(players);
  
      let round = 0;
      game.deal();
      game.makeBid(players[0], 1);

      expect(() => game.makeBid(players[2], 1)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[2]]).toEqual(null);
    });
  });
});
