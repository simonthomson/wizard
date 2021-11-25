"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serveApp = serveApp;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function serveApp(req, res) {
  res.sendFile(_path["default"].join(__dirname, '../../../app/build/index.html'));
}

;