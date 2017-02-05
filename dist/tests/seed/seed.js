'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.populateUsers = exports.populateTodos = exports.todos = exports.users = undefined;

var _mongodb = require('mongodb');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _todo = require('../../models/todo');

var _todo2 = _interopRequireDefault(_todo);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOneId = new _mongodb.ObjectID();
var userTwoId = new _mongodb.ObjectID();
var users = exports.users = [{
  _id: userOneId,
  email: 'paul@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: _jsonwebtoken2.default.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'weston@gmail.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: _jsonwebtoken2.default.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}];

var todos = exports.todos = [{
  _id: new _mongodb.ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new _mongodb.ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

var populateTodos = exports.populateTodos = function populateTodos(done) {
  _todo2.default.remove({}).then(function () {
    return _todo2.default.insertMany(todos);
  }).then(function () {
    return done();
  });
};

var populateUsers = exports.populateUsers = function populateUsers(done) {
  _user2.default.remove({}).then(function () {
    var userOne = new _user2.default(users[0]).save();
    var userTwo = new _user2.default(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(function () {
    return done();
  }).catch(function (err) {
    return console.log(err);
  });
};