'use strict';

var _config = require('./config.json');

var config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  (function () {
    var envConfig = config[env];
    Object.keys(envConfig).forEach(function (key) {
      process.env[key] = envConfig[key];
    });
  })();
}