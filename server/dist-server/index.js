"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _homeRoutes = require("./routes/home-routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 3000;
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../../app/build')));
app.get('/', _homeRoutes.serveApp);
app.get('/createGame', _homeRoutes.serveApp);
app.listen(port, function () {
  console.info("Listening on port ".concat(port));
});