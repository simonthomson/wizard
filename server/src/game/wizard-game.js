import { countInArray, countUniqueElementsInArray, shuffle } from '../../../shared/js/util/util';
import Card from './card';
import { Suits, Ranks, StandardPlayingCardRanks, CardTypes, SET_OF_ROUNDS_TO_PLAY_AUTOMATIC } from '../../../shared/js/util/constants';
import IllegalPlayException from './exceptions/illegal-play-exception';
import GameException from './exceptions/game-exception';

class WizardGame {
  constructor(
    players,
    numberOfWizards = 4,
    numberOfJesters = 4,
    setOfRoundsToPlay = SET_OF_ROUNDS_TO_PLAY_AUTOMATIC,
    suits = [Suits.Clubs, Suits.Spades, Suits.Diamonds, Suits.Hearts],
    ranks = StandardPlayingCardRanks,
    pointsForCorrectBid = 20,
    pointsForWonTrickGivenCorrectBid = 10,
    pointsForWonTrickRegardlessOfBid = 0,
    pointsPerOtherPlayerWhoMissedTheirBid = 0,
    pointsPerDiscrepancyFromBid = -10
  ) {
    const minNumberOfPlayers = 2;
    if (players.length < minNumberOfPlayers) {
      throw new GameException(`Cannot start a game with ${players.length} players. At least ${minNumberOfPlayers} are required`);
    }

    if (countUniqueElementsInArray(players) < players.length) {
      throw new GameException(`Cannot start a game with duplicate players.`);
    }

    this.players = players;
    this.numberOfWizards = numberOfWizards;
    this.numberOfJesters = numberOfJesters;
    this.suits = suits;
    this.ranks = ranks;

    this.scoringRules = {
      pointsForCorrectBid,
      pointsForWonTrickGivenCorrectBid,
      pointsForWonTrickRegardlessOfBid,
      pointsPerOtherPlayerWhoMissedTheirBid,
      pointsPerDiscrepancyFromBid
    };

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
      dealerIndex: 0,
      leadForInProgressTrickIndex: 1,
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

    for (let suit of suits) {
      for (let rank of ranks) {
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
      dealerIndex: this.state.dealerIndex,
      leadForInProgressTrickIndex: this.state.leadForInProgressTrickIndex,
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

    if (this.state.deck.length > 0) {
      this.state.cardShowingTrump = this.state.deck.pop();
    }
  }

  makeBid(player, bid) {
    if (this.getFullState().trickBids[player]) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid because they have already bid this round`);
    }
    if (bid > this.setOfRoundsToPlay[this.state.round]) {
      throw new IllegalPlayException(`Player ${player} cannot place a bid of ${bid} because there are only ${this.setOfRoundsToPlay[this.getPublicState().round]} tricks in the round`);
    }
    
    let playerIndex = (this.getFullState().dealerIndex + 1) % this.players.length;
    let playerWhoseTurnItIsToBid = this.players[playerIndex];

    while (this.getFullState().trickBids[playerWhoseTurnItIsToBid] !== null) {
      playerIndex = (playerIndex + 1) % this.players.length;
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

  _bidsComplete() {
    for (let player of this.players) {
      if (this.state.trickBids[player] === null) {
        return false;
      }
    }
    return true;
  }

  _leadSuit() {
    if (!this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]]) {
      return null;
    }
    if (this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].suit) {
      return this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].suit;
    }
    else if (this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].type === CardTypes.Jester) {
      // the first non-jester makes lead
      let playerIndex = this.state.leadForInProgressTrickIndex;
      playerIndex = (playerIndex + 1) % this.players.length;
      while (this.state.inProgressTrick[this.players[playerIndex]] !== null
        && this.state.inProgressTrick[this.players[playerIndex]].type === CardTypes.Jester
        && playerIndex !== this.state.leadForInProgressTrickIndex) {
        playerIndex = (playerIndex + 1) % this.players.length;
      }
      if (this.state.inProgressTrick[this.players[playerIndex]].suit) {
        return this.state.inProgressTrick[this.players[playerIndex]].suit;
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }

  _allCardsPlayedForThisTrick() {
    for (let player of this.players) {
      if (this.state.inProgressTrick[player] === null) {
        return false;
      }
    }
    return true;
  }

  _getPlayerCurrentlyWinningThisTrick() {
    let leadSuit = this._leadSuit();
    let trumpSuit = this.state.cardShowingTrump ? this.state.cardShowingTrump.suit || null : null;
    let currentlyWinningCard = null;
    const beatsCurrentlyWinningCard = (candidateCard) => {
      if (currentlyWinningCard === null) {
        return true;
      }
      if (candidateCard.suit && currentlyWinningCard && currentlyWinningCard.suit) {
        if (candidateCard.suit === trumpSuit && currentlyWinningCard.suit !== trumpSuit) {
          return true;
        }
        else if (candidateCard.suit === leadSuit && currentlyWinningCard.suit === leadSuit) {
          if (this.ranks.indexOf(candidateCard.rank) > this.ranks.indexOf(currentlyWinningCard.rank)) {
            return true;
          }
        }
        else if (candidateCard.suit === trumpSuit && currentlyWinningCard.suit === trumpSuit) {
          if (this.ranks.indexOf(candidateCard.rank) > this.ranks.indexOf(currentlyWinningCard.rank)) {
            return true;
          }
        }
        return false;
      }
      if (currentlyWinningCard.type === CardTypes.Wizard) {
        return false;
      }
      if (currentlyWinningCard.type === CardTypes.Jester) {
        if (candidateCard.type === CardTypes.Jester) {
          return false;
        }
        else {
          return true;
        }
      }
      if (currentlyWinningCard.type === CardTypes.Value) {
        if (candidateCard.type === CardTypes.Jester) {
          return false;
        }
        if (candidateCard.type === CardTypes.Wizard) {
          return true;
        }
      }
    };
    let numberOfPlayersChecked = 0;
    let playerIndex = this.state.leadForInProgressTrickIndex;

    let currentlyWinningPlayer = null;
    while (numberOfPlayersChecked < this.players.length) {
      if (beatsCurrentlyWinningCard(this.state.inProgressTrick[this.players[playerIndex]])) {
        currentlyWinningCard = this.state.inProgressTrick[this.players[playerIndex]];
        currentlyWinningPlayer = this.players[playerIndex];
      }
      numberOfPlayersChecked++;
      playerIndex = (playerIndex + 1) % this.players.length;
    }

    return currentlyWinningPlayer;
  }

  playCard(player, cardIndex) {
    if (this.state.inProgressTrick[player]) {
      throw new IllegalPlayException(`Player ${player} cannot play a card because they have already played into this trick.`);
    }

    if (!this._bidsComplete()) {
      throw new IllegalPlayException(`Player ${player} cannot play a card because there are still players who have yet to bid.`);
    }

    let playerIndex = this.state.leadForInProgressTrickIndex;
    let playerWhoseTurnItIsToPlay = this.players[playerIndex];

    while (this.state.inProgressTrick[playerWhoseTurnItIsToPlay] !== null) {
      playerIndex = (playerIndex + 1) % this.players.length;
      playerWhoseTurnItIsToPlay = this.players[playerIndex];
    }

    if (playerWhoseTurnItIsToPlay !== player) {
      throw new IllegalPlayException(`Player ${player} cannot play a card because it is not their turn.`);
    }

    let leadSuit = this._leadSuit();
    if (leadSuit && this.state.hands[player][cardIndex].suit
      && leadSuit !== this.state.hands[player][cardIndex].suit) {
        // the player is playing a suited card that does not match the suit led.
        // This is only allowed if the player is void in the lead suit.
        if (this.state.hands[player].some(card => card.suit === leadSuit)) {
          throw new IllegalPlayException(`Player ${player} cannot play a card of suit ${this.state.hands[player][cardIndex].suit} because they have a card of suit ${leadSuit} in their hand, and ${leadSuit} was lead in this trick.`);
        }
    }

    this.state.inProgressTrick[player] = this.state.hands[player][cardIndex];
    this.state.hands[player].splice(cardIndex, 1);

    if (this._allCardsPlayedForThisTrick()) {
      // figure out the winner and give the trick to them
      let winningPlayer = this._getPlayerCurrentlyWinningThisTrick();

      this.state.wonTricks[winningPlayer].push(this.state.inProgressTrick);
      for (let player of this.players) {
        this.state.inProgressTrick[player] = null;
      }
      this.state.leadForInProgressTrickIndex = this.players.indexOf(winningPlayer);
    }
  }

  advanceToTheNextRound() {
    for (let player of this.players) {
      if (this.state.trickBids[player] === null) {
        throw new GameException(`Could not advance to the next round because one or more players have not placed trick bids.`);
      }
      if (this.state.hands[player].length > 0) {
        throw new GameException(`Could not advance to the next roundn because one or more players still have cards in their hands`);
      }
    }

    // record all scores
    for (let player of this.players) {
      this.state.scoreSheet[player].bid = this.state.trickBids[player];
      let totalRoundScore = 0;
      if (this.state.wonTricks[player].length === this.state.trickBids[player]) {
        totalRoundScore += this.scoringRules.pointsForCorrectBid;

        totalRoundScore += this.scoringRules.pointsForWonTrickGivenCorrectBid * this.state.wonTricks[player].length;
      }
      else {
        totalRoundScore += (Math.abs(this.state.wonTricks[player].length - this.state.trickBids[player])) * this.scoringRules.pointsPerDiscrepancyFromBid;
      }

      totalRoundScore += this.scoringRules.pointsForWonTrickRegardlessOfBid * this.state.wonTricks[player].length;

      let otherPlayersWhoMissedTheirBid = countInArray(this.players.filter(otherPlayer => otherPlayer !== player), otherPlayer => {
        return (this.state.wonTricks[otherPlayer].length !== this.state.trickBids[otherPlayer]);
      });

      totalRoundScore += this.scoringRules.pointsPerOtherPlayerWhoMissedTheirBid * otherPlayersWhoMissedTheirBid;

      this.state.scoreSheet[player].pointsGained = totalRoundScore;
    }

    // clear all round state
    for (let player of this.players) {
      this.state.trickBids[player] = null;

      for (let wonTrick of this.state.wonTricks[player]) {
        for (let card of Object.values(wonTrick)) {
          this.state.deck.push(card);
        }
      }
      this.state.wonTricks[player] = [];

      if (this.state.hands[player].length > 0) {
        for (let card of this.state.hands[player]) {
          this.state.deck.push(card);
        }
      }
      this.state.hands[player] = [];

      if (this.state.cardShowingTrump !== null) {
        this.state.deck.push(this.state.cardShowingTrump);
        this.state.cardShowingTrump = null;
      }

      if (this.state.inProgressTrick[player] !== null) {
        this.state.deck.push(this.state.inProgressTrick[player]);
        this.state.inProgressTrick[player] = null;
      }
    }

    this.state.round++;
    this.state.dealerIndex = (this.state.dealerIndex + 1) % this.players.length;
    this.state.leadForInProgressTrickIndex = (this.state.dealerIndex + 1) % this.players.length;
  }
}

export default WizardGame;
