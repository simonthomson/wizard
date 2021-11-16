import { shuffle } from '../../../shared/js/util/util';
import Card from './card';
import { Suits, Ranks, StandardPlayingCardRanks, CardTypes, SET_OF_ROUNDS_TO_PLAY_AUTOMATIC } from './constants';
import IllegalPlayException from './exceptions/illegal-play-exception';

class WizardGame {
  constructor(
    players,
    numberOfWizards = 4,
    numberOfJesters = 4,
    setOfRoundsToPlay = SET_OF_ROUNDS_TO_PLAY_AUTOMATIC,
    suits = [Suits.Clubs, Suits.Spades, Suits.Diamonds, Suits.Hearts],
    ranks = StandardPlayingCardRanks
  ) {
    this.players = players;
    this.numberOfWizards = numberOfWizards;
    this.numberOfJesters = numberOfJesters;
    this.suits = suits;
    this.ranks = ranks;

    if (setOfRoundsToPlay === SET_OF_ROUNDS_TO_PLAY_AUTOMATIC) {
      this.totalRoundsThatWillBePlayed = Math.floor((numberOfWizards + numberOfJesters + suits.length * ranks.length) / players.length);
      this.setOfRoundsToPlay = [];
      for (let i = 1; i <= this.totalRoundsThatWillBePlayed; i++) {
        this.setOfRoundsToPlay.push(i);
      }
    }
    else {
      this.setOfRoundsToPlay = setOfRoundsToPlay;
      this.totalRoundsThatWillBePlayed = setOfRoundsToPlay.length;
    }

    this.state = {
      round: 0,
      deck: WizardGame.createNewDeck(numberOfWizards, numberOfJesters, suits, ranks),
      hands: players.reduce((handsObj, player) => { let ret = { ...handsObj }; ret[player] = []; return ret; }, {}),
      scoreSheet: players.reduce((scoreSheetObj, player) => { let ret = { ...scoreSheetObj }; ret[player] = Array(this.totalRoundsThatWillBePlayed).fill({}); return ret; }, {}),
      cardShowingTrump: null,
      inProgressTrick: players.reduce((inProgressTrickObj, player) => { let ret = { ...inProgressTrickObj }; ret[player] = null; return ret; }, {}),
      leadForInProgressTrick: players[0],
      wonTricks: players.reduce((wonTricksObj, player) => { let ret = { ...wonTricksObj }; ret[player] = []; return ret; }, {}),
      trickBids: players.reduce((trickBidsObj, player) => { let ret = { ...trickBidsObj }; ret[player] = null; return ret; }, {})
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

  getFullState() {
    return this.state;
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

  _putAllCardsBackInTheDeck() {
    for (let playerHand of Object.values(this.state.hands)) {
      while (playerHand.length > 0) {
        this.state.deck.push(playerHand.pop());
      }
    }
    for (let wonTricksByPlayer of Object.values(this.state.wonTricks)) {
      while (wonTricksByPlayer.length > 0) {
        let wonTrick = wonTricksByPlayer.pop();
        for (let card of Object.values(wonTrick)) {
          this.state.deck.push(card);
        }
      }
    }
    if (this.state.cardShowingTrump) {
      deck.push(this.state.cardShowingTrump);
      this.state.cardShowingTrump = null;
    }
    for (let player of this.players) {
      let card = this.state.inProgressTrick[player];
      if (card) {
        deck.push(card);
      }
      this.state.inProgressTrick[player] = null;
    }
  }

  deal() {
    this._putAllCardsBackInTheDeck();
    this.state.deck = shuffle(this.state.deck);

    let cardsToDealPerPlayer = this.setOfRoundsToPlay[this.state.round];
    for (let i = 0; i < cardsToDealPerPlayer; i++) {
      for (let player of this.players) {
        this.state.hands[player].push(this.state.deck.pop());
      }
    }
  }

  makeBid(player, bid) {
    if (this.getFullState().trickBids[player]) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid because they have already bid this round`);
    }
    if (bid > this.setOfRoundsToPlay[this.state.round]) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid of ${bid} because there are only ${this.setOfRoundsToPlay[this.getPublicState().round]} tricks in the round`);
    }
    
    let playerWhoseTurnItIsToBid = this.getFullState().leadForInProgressTrick;
    let playerIndex = 0;
    while (this.players[playerIndex] !== playerWhoseTurnItIsToBid) {
      playerIndex++;
    }

    while (this.getFullState().trickBids[playerWhoseTurnItIsToBid]) {
      if (playerIndex === this.players.length - 1) {
        playerIndex = 0;
      }
      else {
        playerIndex++; 
      }
      playerWhoseTurnItIsToBid = this.players[playerIndex];
    }

    if (playerWhoseTurnItIsToBid !== player) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid because it is not their turn to bid`);
    }

    let numberOfPlayersWhoHaveBid = 0;
    let bidTotalThusFar = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.getFullState().trickBids[this.players[i]]) {
        bidTotalThusFar += this.getFullState().trickBids[this.players[i]];
        numberOfPlayersWhoHaveBid++;
      }
    }

    if (numberOfPlayersWhoHaveBid === this.players.length - 1 && (bidTotalThusFar + bid) === this.setOfRoundsToPlay[this.state.round]) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid of ${bid} because it would make the total bids equal the number of tricks for the round`);
    }

    this.state.trickBids[player] = bid;
    this.state.scoreSheet[player][this.state.round].bid = bid;
  }
}

export default WizardGame;
