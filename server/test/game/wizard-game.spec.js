import WizardGame from '../../src/game/wizard-game';
import {countInArray} from '../../../shared/js/util/util';
import { CardTypes, Suits, Ranks } from '../../../shared/js/util/constants';
import IllegalPlayException from '../../src/game/exceptions/illegal-play-exception';
import GameException from '../../src/game/exceptions/game-exception';

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

    it('requires at least two players to make a game', () => {
      let players = ['lonely-guy-1'];

      expect(() => {
        let game = new WizardGame(players);
        expect(game).toBeUndefined();
      }).toThrow(GameException);
    });

    it('fails to start a game if the players list contains duplicates', () => {
      let players = ['cheeky-fella-1', 'unsuspecting-player-2', 'cheeky-fella-1', 'unsuspecting-player-4'];

      expect(() => {
        let game = new WizardGame(players);
      }).toThrow(GameException);
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

    it('places a card face up to show trump if there are any left in the deck', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();

      expect(game.getPublicState().cardShowingTrump).toBeTruthy();
    });

    it('leaves no card face-up for trump if all cards are dealt out to players', () => {
      let players = ['player-id-1', 'player-id-2', 'player-id-3'];
      let numberOfWizards = 0;
      let numberOfJesters = 1;
      let setOfRoundsToPlay = [3, 5];
      let suits = [Suits.Hearts, Suits.Spades];
      let ranks = [Ranks.Two, Ranks.Three, Ranks.Four, Ranks.Five];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      expect(game.getPublicState().cardShowingTrump).toBeFalsy();
    });
  });

  describe('makeBid', () => {
    it('records the bid in the current game state', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      game.deal();
      game.makeBid(players[1], 0);
      expect(game.getPublicState().trickBids[players[1]]).toEqual(0);
    });

    it('records the bid to the scoreSheet', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      let round = 0;
      game.deal();
      game.makeBid(players[1], 0);
      expect(game.getPublicState().scoreSheet[players[1]][round].bid).toEqual(0);
    });

    it('disallows a bid that would make the bids equal the tricks by the last player to bid', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      game.deal();
      game.makeBid(players[1], 1);

      expect(() => game.makeBid(players[0], 0)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(null);
    });

    it('disallows a bid that exceeds the number of tricks in the round', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players, 4, 4, [3, 5]);
  
      game.deal();

      expect(() => game.makeBid(players[1], 4)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[1]]).toEqual(null);
    });

    it('disallows a bid from a player who has already bid that round', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);
  
      game.deal();
      game.makeBid(players[1], 1);

      expect(() => game.makeBid(players[1], 0)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[1]]).toEqual(1);
    });

    it('disallows a bid from a player whos turn it is not', () => {
      let players = ['player-id-1', 'player-id-2', 'player-id-3'];
  
      let game = new WizardGame(players);
  
      game.deal();
      game.makeBid(players[1], 1);

      expect(() => game.makeBid(players[0], 1)).toThrow(IllegalPlayException);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(null);
    });
  });

  describe('playCard', () => {
    it('plays the card into the current trick', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();

      let cardInPlayer1Hand = game.getFullState().hands[players[1]][0];

      game.makeBid(players[1], 1);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      expect(game.getPublicState().inProgressTrick[players[1]]).toEqual(cardInPlayer1Hand);
      expect(game.getFullState().hands[players[1]].length).toEqual(0);
    });

    it('disallows playing out of turn', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();

      game.makeBid(players[1], 1);
      game.makeBid(players[0], 1);

      expect(() => game.playCard(players[0], 0)).toThrow(IllegalPlayException);
    });

    it('disallows not following suit if not void in that suit', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 0;
      let numberOfJesters = 0;
      let setOfRoundsToPlay = [2, 3];
      let suits = [Suits.Hearts, Suits.Spades];
      let ranks = [Ranks.Two, Ranks.Three, Ranks.Four, Ranks.Five];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      // manually put specific cards in players' hands
      for (let i = 0; i < players.length; i++) {
        let deckPositionToSwap = 0;
        while (game.state.hands[players[i]][0].suit === game.state.hands[players[i]][1].suit) {
          if (deckPositionToSwap >= game.state.deck.length) {
            expect(deckPositionToSwap).toBeLessThan(game.state.deck.length);
          }
          [game.state.deck[deckPositionToSwap], game.state.hands[players[i]][0]] = [game.state.hands[players[i]][0], game.state.deck[deckPositionToSwap]];
          deckPositionToSwap++;
        }
      }

      // now both players have one of each suit
      let positionOfHeartForPlayer0 = game.getFullState().hands[players[0]][0].suit === Suits.Hearts ? 0 : 1;
      let positionOfSpadeForPlayer1 = game.getFullState().hands[players[1]][0].suit === Suits.Spades ? 0 : 1;

      game.makeBid(players[1], 0);
      game.makeBid(players[0], 1);

      game.playCard(players[1], positionOfSpadeForPlayer1);
      
      expect(() => game.playCard(players[0], positionOfHeartForPlayer0)).toThrow(IllegalPlayException);
    });

    it('gives the trick to the winner if this is the last card played in the trick.', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 0;
      let numberOfJesters = 0;
      let setOfRoundsToPlay = [2];
      let suits = [Suits.Hearts, Suits.Spades, Suits.Diamonds, Suits.Clubs];
      let ranks = [Ranks.Ace];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      game.makeBid(players[1], 2);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      expect(game.getPublicState().wonTricks[players[1]].length).toEqual(1);
      expect(game.getPublicState().inProgressTrick[players[1]]).toEqual(null);

      // expect that the winner of the last trick will lead the next one
      expect(game.players[game.getPublicState().leadForInProgressTrickIndex]).toEqual(players[1]);
    });
  });

  describe('advanceToTheNextRound', () => {
    it('increments the round', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();
      game.makeBid(players[1], 1);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.advanceToTheNextRound();

      expect(game.getPublicState().round).toEqual(1);
    });

    it('fails to advance if the current round is not complete', () => {
      let players = ['player-id-1', 'player-id-2'];
  
      let game = new WizardGame(players);

      game.deal();

      game.makeBid(players[1], 1);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);

      expect(() => game.advanceToTheNextRound()).toThrow(GameException);
    });

    it('fills in the scoreboard based on the results of the completed round', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 0;
      let numberOfJesters = 0;
      let setOfRoundsToPlay = [2, 3];
      let suits = [
        Suits.Hearts,
        Suits.Spades,
        Suits.Diamonds,
        Suits.Clubs,
        Suits.Trees,
        Suits.Crosses
      ];
      let ranks = [Ranks.Ace];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      game.makeBid(players[1], 2);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.advanceToTheNextRound();

      expect(game.getPublicState().scoreSheet[players[1]].bid).toEqual(2);
      expect(game.getPublicState().scoreSheet[players[1]].pointsGained).toEqual(40);
      expect(game.getPublicState().scoreSheet[players[0]].bid).toEqual(1);
      expect(game.getPublicState().scoreSheet[players[0]].pointsGained).toEqual(-10);
    });

    it('clears the current round state so it is fresh for the new round', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 0;
      let numberOfJesters = 0;
      let setOfRoundsToPlay = [2, 3];
      let suits = [
        Suits.Hearts,
        Suits.Spades,
        Suits.Diamonds,
        Suits.Clubs,
        Suits.Trees,
        Suits.Crosses
      ];
      let ranks = [Ranks.Ace];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      game.makeBid(players[1], 2);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.advanceToTheNextRound();

      expect(game.getPublicState().trickBids[players[1]]).toEqual(null);
      expect(game.getPublicState().trickBids[players[0]]).toEqual(null);
      expect(game.getPublicState().wonTricks[players[1]].length).toEqual(0);
      expect(game.getPublicState().wonTricks[players[0]].length).toEqual(0);

      expect(game.getFullState().hands[players[1]].length).toEqual(0);
      expect(game.getFullState().hands[players[0]].length).toEqual(0);
      
      expect(game.getFullState().cardShowingTrump).toEqual(null);
      expect(game.getFullState().inProgressTrick[players[1]]).toEqual(null);
      expect(game.getFullState().inProgressTrick[players[0]]).toEqual(null);
    });

    it('advances the dealer to the next player', () => {
      let players = ['player-id-1', 'player-id-2'];
      let numberOfWizards = 0;
      let numberOfJesters = 0;
      let setOfRoundsToPlay = [2, 3];
      let suits = [
        Suits.Hearts,
        Suits.Spades,
        Suits.Diamonds,
        Suits.Clubs,
        Suits.Trees,
        Suits.Crosses
      ];
      let ranks = [Ranks.Ace];

      let game = new WizardGame(players, numberOfWizards, numberOfJesters, setOfRoundsToPlay, suits, ranks);

      game.deal();

      game.makeBid(players[1], 2);
      game.makeBid(players[0], 1);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.playCard(players[1], 0);
      game.playCard(players[0], 0);

      game.advanceToTheNextRound();

      expect(game.getPublicState().dealerIndex).toEqual(1);
      expect(game.getPublicState().leadForInProgressTrickIndex).toEqual(0);
    });
  });
});
