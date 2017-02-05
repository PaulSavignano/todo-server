'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongoose = require('./db/mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _todo = require('./models/todo');

var _todo2 = _interopRequireDefault(_todo);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _authenticate = require('./middleware/authenticate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT;

app.use(_bodyParser2.default.json());

app.post('/todos', _authenticate.authenticate, function (req, res) {
  var todo = new _todo2.default({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(function (doc) {
    res.send(doc);
  }, function (err) {
    res.status(400).send(err);
  });
});

app.get('/todos', _authenticate.authenticate, function (req, res) {
  _todo2.default.find({
    _creator: req.user._id
  }).then(function (todos) {
    res.send({ todos: todos });
  }, function (err) {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', _authenticate.authenticate, function (req, res) {
  var id = req.params.id;
  if (!_mongodb.ObjectID.isValid(id)) return res.status(404).send();
  _todo2.default.findOne({
    _id: id,
    _creator: req.user._id
  }).then(function (todo) {
    if (!todo) return res.status(404).send();
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send(err);
  });
});

app.delete('/todos/:id', _authenticate.authenticate, function (req, res) {
  var id = req.params.id;
  if (!_mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  _todo2.default.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(function (todo) {
    if (!todo) return res.status(404).send();
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send();
  });
});

app.patch('/todos/:id', _authenticate.authenticate, function (req, res) {
  var id = req.params.id;
  var _req$body = req.body,
      text = _req$body.text,
      completed = _req$body.completed;

  if (!_mongodb.ObjectID.isValid(id)) {
    return res.statue(404).send();
  }
  if (typeof completed === 'boolean' && completed) {
    req.body.completedAt = new Date().getTime();
  } else {
    req.body.completed = false;
    req.body.completedAt = null;
  }
  _todo2.default.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, { $set: req.body }, { new: true }).then(function (todo) {
    if (!todo) {
      return res.status(404).send;
    }
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send;
  });
});

app.post('/users', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  var user = new _user2.default({ email: email, password: password });
  user.save().then(function () {
    return user.generateAuthToken();
  }).then(function (token) {
    res.header('x-auth', token).send(user);
  }).catch(function (err) {
    res.status(400).send(err);
  });
});

app.post('/users/login', function (req, res) {
  var _req$body3 = req.body,
      email = _req$body3.email,
      password = _req$body3.password;

  _user2.default.findByCredentials(email, password).then(function (user) {
    return user.generateAuthToken().then(function (token) {
      return res.header('x-auth', token).send(user);
    });
  }).catch(function (err) {
    return res.status(400).send();
  });
});

app.get('/users/me', _authenticate.authenticate, function (req, res) {
  res.send(req.user);
});

app.delete('/users/me/token', _authenticate.authenticate, function (req, res) {
  req.user.removeToken(req.token).then(function () {
    res.status(200).send();
  }, function () {
    res.status(400).send();
  });
});

app.listen(port, function () {
  console.log('Started up at port ' + port);
});

exports.default = app;