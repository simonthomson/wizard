"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _constants = require("../../../shared/js/util/constants");

var _gameException = _interopRequireDefault(require("./exceptions/game-exception"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(type) {
  var suit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var rank = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  _classCallCheck(this, Card);

  if (!Object.values(_constants.CardTypes).some(function (cardType) {
    return cardType === type;
  })) {
    throw new _gameException["default"]("Tried to create a card of type ".concat(type, ", but ").concat(type, " is not a valid card type."));
  }

  this.type = type;

  if (this.type === _constants.CardTypes.Value) {
    if (!suit) {
      throw new _gameException["default"]("Tried to create card of type ".concat(type, ", but no suit was given."));
    }

    if (!rank) {
      throw new _gameException["default"]("Tried to create card of type ".concat(type, ", but no rank was given."));
    }

    this.suit = suit;
    this.rank = rank;
  }
};

var _default = Card;
exports["default"] = _default;