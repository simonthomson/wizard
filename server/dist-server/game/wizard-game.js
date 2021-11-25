"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../../../shared/js/util/util");

var _card3 = _interopRequireDefault(require("./card"));

var _constants = require("../../../shared/js/util/constants");

var _illegalPlayException = _interopRequireDefault(require("./exceptions/illegal-play-exception"));

var _gameException = _interopRequireDefault(require("./exceptions/game-exception"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WizardGame = /*#__PURE__*/function () {
  function WizardGame(players) {
    var _this = this;

    var numberOfWizards = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    var numberOfJesters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
    var setOfRoundsToPlay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constants.SET_OF_ROUNDS_TO_PLAY_AUTOMATIC;
    var suits = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [_constants.Suits.Clubs, _constants.Suits.Spades, _constants.Suits.Diamonds, _constants.Suits.Hearts];
    var ranks = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants.StandardPlayingCardRanks;
    var pointsForCorrectBid = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 20;
    var pointsForWonTrickGivenCorrectBid = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 10;
    var pointsForWonTrickRegardlessOfBid = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
    var pointsPerOtherPlayerWhoMissedTheirBid = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
    var pointsPerDiscrepancyFromBid = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : -10;

    _classCallCheck(this, WizardGame);

    var minNumberOfPlayers = 2;

    if (players.length < minNumberOfPlayers) {
      throw new _gameException["default"]("Cannot start a game with ".concat(players.length, " players. At least ").concat(minNumberOfPlayers, " are required"));
    }

    if ((0, _util.countUniqueElementsInArray)(players) < players.length) {
      throw new _gameException["default"]("Cannot start a game with duplicate players.");
    }

    this.players = players;
    this.numberOfWizards = numberOfWizards;
    this.numberOfJesters = numberOfJesters;
    this.suits = suits;
    this.ranks = ranks;
    this.scoringRules = {
      pointsForCorrectBid: pointsForCorrectBid,
      pointsForWonTrickGivenCorrectBid: pointsForWonTrickGivenCorrectBid,
      pointsForWonTrickRegardlessOfBid: pointsForWonTrickRegardlessOfBid,
      pointsPerOtherPlayerWhoMissedTheirBid: pointsPerOtherPlayerWhoMissedTheirBid,
      pointsPerDiscrepancyFromBid: pointsPerDiscrepancyFromBid
    };

    if (setOfRoundsToPlay === _constants.SET_OF_ROUNDS_TO_PLAY_AUTOMATIC) {
      this.totalRoundsThatWillBePlayed = Math.floor((numberOfWizards + numberOfJesters + suits.length * ranks.length) / players.length);
      this.setOfRoundsToPlay = [];

      for (var i = 1; i <= this.totalRoundsThatWillBePlayed; i++) {
        this.setOfRoundsToPlay.push(i);
      }
    } else {
      this.setOfRoundsToPlay = setOfRoundsToPlay;
      this.totalRoundsThatWillBePlayed = setOfRoundsToPlay.length;
    }

    this.state = {
      round: 0,
      deck: WizardGame.createNewDeck(numberOfWizards, numberOfJesters, suits, ranks),
      hands: players.reduce(function (handsObj, player) {
        var ret = _objectSpread({}, handsObj);

        ret[player] = [];
        return ret;
      }, {}),
      scoreSheet: players.reduce(function (scoreSheetObj, player) {
        var ret = _objectSpread({}, scoreSheetObj);

        ret[player] = Array(_this.totalRoundsThatWillBePlayed).fill({});
        return ret;
      }, {}),
      cardShowingTrump: null,
      inProgressTrick: players.reduce(function (inProgressTrickObj, player) {
        var ret = _objectSpread({}, inProgressTrickObj);

        ret[player] = null;
        return ret;
      }, {}),
      dealerIndex: 0,
      leadForInProgressTrickIndex: 1,
      wonTricks: players.reduce(function (wonTricksObj, player) {
        var ret = _objectSpread({}, wonTricksObj);

        ret[player] = [];
        return ret;
      }, {}),
      trickBids: players.reduce(function (trickBidsObj, player) {
        var ret = _objectSpread({}, trickBidsObj);

        ret[player] = null;
        return ret;
      }, {})
    };
  }

  _createClass(WizardGame, [{
    key: "getFullState",
    value: function getFullState() {
      return this.state;
    }
  }, {
    key: "getPublicState",
    value: function getPublicState() {
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
  }, {
    key: "getStateKnownByPlayer",
    value: function getStateKnownByPlayer(player) {
      return _objectSpread(_objectSpread({}, this.getPublicState()), {}, {
        hand: this.state.hands[player]
      });
    }
  }, {
    key: "_putAllCardsBackInTheDeck",
    value: function _putAllCardsBackInTheDeck() {
      for (var _i = 0, _Object$values = Object.values(this.state.hands); _i < _Object$values.length; _i++) {
        var playerHand = _Object$values[_i];

        while (playerHand.length > 0) {
          this.state.deck.push(playerHand.pop());
        }
      }

      for (var _i2 = 0, _Object$values2 = Object.values(this.state.wonTricks); _i2 < _Object$values2.length; _i2++) {
        var wonTricksByPlayer = _Object$values2[_i2];

        while (wonTricksByPlayer.length > 0) {
          var wonTrick = wonTricksByPlayer.pop();

          for (var _i3 = 0, _Object$values3 = Object.values(wonTrick); _i3 < _Object$values3.length; _i3++) {
            var card = _Object$values3[_i3];
            this.state.deck.push(card);
          }
        }
      }

      if (this.state.cardShowingTrump) {
        deck.push(this.state.cardShowingTrump);
        this.state.cardShowingTrump = null;
      }

      var _iterator = _createForOfIteratorHelper(this.players),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var player = _step.value;
          var _card = this.state.inProgressTrick[player];

          if (_card) {
            deck.push(_card);
          }

          this.state.inProgressTrick[player] = null;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "deal",
    value: function deal() {
      this._putAllCardsBackInTheDeck();

      this.state.deck = (0, _util.shuffle)(this.state.deck);
      var cardsToDealPerPlayer = this.setOfRoundsToPlay[this.state.round];

      for (var i = 0; i < cardsToDealPerPlayer; i++) {
        var _iterator2 = _createForOfIteratorHelper(this.players),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var player = _step2.value;
            this.state.hands[player].push(this.state.deck.pop());
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (this.state.deck.length > 0) {
        this.state.cardShowingTrump = this.state.deck.pop();
      }
    }
  }, {
    key: "makeBid",
    value: function makeBid(player, bid) {
      if (this.getFullState().trickBids[player]) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot place a bid because they have already bid this round"));
      }

      if (bid > this.setOfRoundsToPlay[this.state.round]) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot place a bid of ").concat(bid, " because there are only ").concat(this.setOfRoundsToPlay[this.getPublicState().round], " tricks in the round"));
      }

      var playerIndex = (this.getFullState().dealerIndex + 1) % this.players.length;
      var playerWhoseTurnItIsToBid = this.players[playerIndex];

      while (this.getFullState().trickBids[playerWhoseTurnItIsToBid] !== null) {
        playerIndex = (playerIndex + 1) % this.players.length;
        playerWhoseTurnItIsToBid = this.players[playerIndex];
      }

      if (playerWhoseTurnItIsToBid !== player) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot place a bid because it is not their turn to bid"));
      }

      var numberOfPlayersWhoHaveBid = 0;
      var bidTotalThusFar = 0;

      for (var i = 0; i < this.players.length; i++) {
        if (this.getFullState().trickBids[this.players[i]]) {
          bidTotalThusFar += this.getFullState().trickBids[this.players[i]];
          numberOfPlayersWhoHaveBid++;
        }
      }

      if (numberOfPlayersWhoHaveBid === this.players.length - 1 && bidTotalThusFar + bid === this.setOfRoundsToPlay[this.state.round]) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot place a bid of ").concat(bid, " because it would make the total bids equal the number of tricks for the round"));
      }

      this.state.trickBids[player] = bid;
      this.state.scoreSheet[player][this.state.round].bid = bid;
    }
  }, {
    key: "_bidsComplete",
    value: function _bidsComplete() {
      var _iterator3 = _createForOfIteratorHelper(this.players),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var player = _step3.value;

          if (this.state.trickBids[player] === null) {
            return false;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return true;
    }
  }, {
    key: "_leadSuit",
    value: function _leadSuit() {
      if (!this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]]) {
        return null;
      }

      if (this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].suit) {
        return this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].suit;
      } else if (this.state.inProgressTrick[this.players[this.state.leadForInProgressTrickIndex]].type === _constants.CardTypes.Jester) {
        // the first non-jester makes lead
        var playerIndex = this.state.leadForInProgressTrickIndex;
        playerIndex = (playerIndex + 1) % this.players.length;

        while (this.state.inProgressTrick[this.players[playerIndex]] !== null && this.state.inProgressTrick[this.players[playerIndex]].type === _constants.CardTypes.Jester && playerIndex !== this.state.leadForInProgressTrickIndex) {
          playerIndex = (playerIndex + 1) % this.players.length;
        }

        if (this.state.inProgressTrick[this.players[playerIndex]].suit) {
          return this.state.inProgressTrick[this.players[playerIndex]].suit;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: "_allCardsPlayedForThisTrick",
    value: function _allCardsPlayedForThisTrick() {
      var _iterator4 = _createForOfIteratorHelper(this.players),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var player = _step4.value;

          if (this.state.inProgressTrick[player] === null) {
            return false;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return true;
    }
  }, {
    key: "_getPlayerCurrentlyWinningThisTrick",
    value: function _getPlayerCurrentlyWinningThisTrick() {
      var _this2 = this;

      var leadSuit = this._leadSuit();

      var trumpSuit = this.state.cardShowingTrump ? this.state.cardShowingTrump.suit || null : null;
      var currentlyWinningCard = null;

      var beatsCurrentlyWinningCard = function beatsCurrentlyWinningCard(candidateCard) {
        if (currentlyWinningCard === null) {
          return true;
        }

        if (candidateCard.suit && currentlyWinningCard && currentlyWinningCard.suit) {
          if (candidateCard.suit === trumpSuit && currentlyWinningCard.suit !== trumpSuit) {
            return true;
          } else if (candidateCard.suit === leadSuit && currentlyWinningCard.suit === leadSuit) {
            if (_this2.ranks.indexOf(candidateCard.rank) > _this2.ranks.indexOf(currentlyWinningCard.rank)) {
              return true;
            }
          } else if (candidateCard.suit === trumpSuit && currentlyWinningCard.suit === trumpSuit) {
            if (_this2.ranks.indexOf(candidateCard.rank) > _this2.ranks.indexOf(currentlyWinningCard.rank)) {
              return true;
            }
          }

          return false;
        }

        if (currentlyWinningCard.type === _constants.CardTypes.Wizard) {
          return false;
        }

        if (currentlyWinningCard.type === _constants.CardTypes.Jester) {
          if (candidateCard.type === _constants.CardTypes.Jester) {
            return false;
          } else {
            return true;
          }
        }

        if (currentlyWinningCard.type === _constants.CardTypes.Value) {
          if (candidateCard.type === _constants.CardTypes.Jester) {
            return false;
          }

          if (candidateCard.type === _constants.CardTypes.Wizard) {
            return true;
          }
        }
      };

      var numberOfPlayersChecked = 0;
      var playerIndex = this.state.leadForInProgressTrickIndex;
      var currentlyWinningPlayer = null;

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
  }, {
    key: "playCard",
    value: function playCard(player, cardIndex) {
      if (this.state.inProgressTrick[player]) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot play a card because they have already played into this trick."));
      }

      if (!this._bidsComplete()) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot play a card because there are still players who have yet to bid."));
      }

      var playerIndex = this.state.leadForInProgressTrickIndex;
      var playerWhoseTurnItIsToPlay = this.players[playerIndex];

      while (this.state.inProgressTrick[playerWhoseTurnItIsToPlay] !== null) {
        playerIndex = (playerIndex + 1) % this.players.length;
        playerWhoseTurnItIsToPlay = this.players[playerIndex];
      }

      if (playerWhoseTurnItIsToPlay !== player) {
        throw new _illegalPlayException["default"]("Player ".concat(player, " cannot play a card because it is not their turn."));
      }

      var leadSuit = this._leadSuit();

      if (leadSuit && this.state.hands[player][cardIndex].suit && leadSuit !== this.state.hands[player][cardIndex].suit) {
        // the player is playing a suited card that does not match the suit led.
        // This is only allowed if the player is void in the lead suit.
        if (this.state.hands[player].some(function (card) {
          return card.suit === leadSuit;
        })) {
          throw new _illegalPlayException["default"]("Player ".concat(player, " cannot play a card of suit ").concat(this.state.hands[player][cardIndex].suit, " because they have a card of suit ").concat(leadSuit, " in their hand, and ").concat(leadSuit, " was lead in this trick."));
        }
      }

      this.state.inProgressTrick[player] = this.state.hands[player][cardIndex];
      this.state.hands[player].splice(cardIndex, 1);

      if (this._allCardsPlayedForThisTrick()) {
        // figure out the winner and give the trick to them
        var winningPlayer = this._getPlayerCurrentlyWinningThisTrick();

        this.state.wonTricks[winningPlayer].push(this.state.inProgressTrick);

        var _iterator5 = _createForOfIteratorHelper(this.players),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _player = _step5.value;
            this.state.inProgressTrick[_player] = null;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        this.state.leadForInProgressTrickIndex = this.players.indexOf(winningPlayer);
      }
    }
  }, {
    key: "advanceToTheNextRound",
    value: function advanceToTheNextRound() {
      var _this3 = this;

      var _iterator6 = _createForOfIteratorHelper(this.players),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var player = _step6.value;

          if (this.state.trickBids[player] === null) {
            throw new _gameException["default"]("Could not advance to the next round because one or more players have not placed trick bids.");
          }

          if (this.state.hands[player].length > 0) {
            throw new _gameException["default"]("Could not advance to the next roundn because one or more players still have cards in their hands");
          }
        } // record all scores

      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var _iterator7 = _createForOfIteratorHelper(this.players),
          _step7;

      try {
        var _loop = function _loop() {
          var player = _step7.value;
          _this3.state.scoreSheet[player].bid = _this3.state.trickBids[player];
          var totalRoundScore = 0;

          if (_this3.state.wonTricks[player].length === _this3.state.trickBids[player]) {
            totalRoundScore += _this3.scoringRules.pointsForCorrectBid;
            totalRoundScore += _this3.scoringRules.pointsForWonTrickGivenCorrectBid * _this3.state.wonTricks[player].length;
          } else {
            totalRoundScore += Math.abs(_this3.state.wonTricks[player].length - _this3.state.trickBids[player]) * _this3.scoringRules.pointsPerDiscrepancyFromBid;
          }

          totalRoundScore += _this3.scoringRules.pointsForWonTrickRegardlessOfBid * _this3.state.wonTricks[player].length;
          var otherPlayersWhoMissedTheirBid = (0, _util.countInArray)(_this3.players.filter(function (otherPlayer) {
            return otherPlayer !== player;
          }), function (otherPlayer) {
            return _this3.state.wonTricks[otherPlayer].length !== _this3.state.trickBids[otherPlayer];
          });
          totalRoundScore += _this3.scoringRules.pointsPerOtherPlayerWhoMissedTheirBid * otherPlayersWhoMissedTheirBid;
          _this3.state.scoreSheet[player].pointsGained = totalRoundScore;
        };

        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          _loop();
        } // clear all round state

      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      var _iterator8 = _createForOfIteratorHelper(this.players),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var _player2 = _step8.value;
          this.state.trickBids[_player2] = null;

          var _iterator9 = _createForOfIteratorHelper(this.state.wonTricks[_player2]),
              _step9;

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var wonTrick = _step9.value;

              for (var _i4 = 0, _Object$values4 = Object.values(wonTrick); _i4 < _Object$values4.length; _i4++) {
                var _card2 = _Object$values4[_i4];
                this.state.deck.push(_card2);
              }
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }

          this.state.wonTricks[_player2] = [];

          if (this.state.hands[_player2].length > 0) {
            var _iterator10 = _createForOfIteratorHelper(this.state.hands[_player2]),
                _step10;

            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                var card = _step10.value;
                this.state.deck.push(card);
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }
          }

          this.state.hands[_player2] = [];

          if (this.state.cardShowingTrump !== null) {
            this.state.deck.push(this.state.cardShowingTrump);
            this.state.cardShowingTrump = null;
          }

          if (this.state.inProgressTrick[_player2] !== null) {
            this.state.deck.push(this.state.inProgressTrick[_player2]);
            this.state.inProgressTrick[_player2] = null;
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      this.state.round++;
      this.state.dealerIndex = (this.state.dealerIndex + 1) % this.players.length;
      this.state.leadForInProgressTrickIndex = (this.state.dealerIndex + 1) % this.players.length;
    }
  }], [{
    key: "createNewDeck",
    value: function createNewDeck(numberOfWizards, numberOfJesters, suits, ranks) {
      var deck = [];

      for (var i = 0; i < numberOfWizards; i++) {
        deck.push(new _card3["default"](_constants.CardTypes.Wizard));
      }

      for (var _i5 = 0; _i5 < numberOfJesters; _i5++) {
        deck.push(new _card3["default"](_constants.CardTypes.Jester));
      }

      var _iterator11 = _createForOfIteratorHelper(suits),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var suit = _step11.value;

          var _iterator12 = _createForOfIteratorHelper(ranks),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var rank = _step12.value;
              deck.push(new _card3["default"](_constants.CardTypes.Value, suit, rank));
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return deck;
    }
  }]);

  return WizardGame;
}();

var _default = WizardGame;
exports["default"] = _default;