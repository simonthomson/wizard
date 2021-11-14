import Card from './card';
import { Suits, Ranks, StandardPlayingCardRanks, CardTypes } from './constants';

class WizardGame {
  constructor(
    players,
    numberOfWizards = 4,
    numberOfJesters = 4,
    suits = [Suits.Clubs, Suits.Spades, Suits.Diamonds, Suits.Hearts],
    ranks = StandardPlayingCardRanks
  ) {
    this.players = players;
    this.numberOfWizards = numberOfWizards;
    this.numberOfJesters = numberOfJesters;
    this.suits = suits;
    this.ranks = ranks;

    this.totalRoundsThatWillBePlayed = Math.floor((numberOfWizards + numberOfJesters + suits.length * ranks.length) / players.length);

    this.state = {
      round: 1,
      deck: WizardGame.createNewDeck(numberOfWizards, numberOfJesters, suits, ranks),
      hands: players.reduce((handsObj, player) => { let ret = { ...handsObj }; ret[player] = []; return ret; }, {}),
      scoreSheet: players.reduce((scoreSheetObj, player) => { let ret = { ...scoreSheetObj }; ret[player] = Array(this.totalRoundsThatWillBePlayed).fill(undefined); return ret; }, {}),
      cardShowingTrump: null,
      inProgressTrick: players.reduce((inProgressTrickObj, player) => { let ret = { ...inProgressTrickObj }; ret[player] = null; return ret; }, {}),
      leadForInProgressTrick: null,
      wonTricks: players.reduce((wonTricksObj, player) => { let ret = { ...wonTricksObj }; ret[player] = []; return ret; }, {}),
      trickBids: players.reduce((trickBidsObj, player) => { let ret = { ...trickBidsObj }; ret[player] = undefined; return ret; }, {})
    };
  }

  static createNewDeck(numberOfWizards, numberOfJesters, suits, ranks) {
    let deck = [];

    for (let i = 0; i < numberOfWizards; i++) {
      deck.push(new Card(CardTypes.Wizard));
    }

    for (let i = 0; i < numberOfJesters; i++) {
      deck.push(new Card(CardTypes.Jester));
    }

    for (let suit in suits) {
      for (let rank in ranks) {
        deck.push(new Card(CardTypes.Value, suit, rank));
      }
    }

    return deck;
  }

  getPublicState() {
    return {
      round: this.state.round,
      deckSize: this.state.deck.length,
      scoreSheet: this.state.scoreSheet,
      cardShowingTrump: this.state.cardShowingTrump,
      inProgressTrick: this.state.inProgressTrick,
      leadForInProgressTrick: this.state.leadForInProgressTrick,
      wonTricks: this.state.wonTricks,
      trickBids: this.state.trickBids
    };
  }

  getStateKnownByPlayer(player) {
    return {
      ...this.getPublicState(),
      hand: this.state.hands[player]
    };
  }
}

export default WizardGame;
