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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

app.use(_bodyParser2.default.json());

app.post('/todos', function (req, res) {
  var todo = new _todo2.default({
    text: req.body.text
  });
  todo.save().then(function (doc) {
    res.send(doc);
  }, function (err) {
    res.status(400).send(err);
  });
});

app.get('/todos', function (req, res) {
  _todo2.default.find().then(function (todos) {
    res.send({ todos: todos });
  }, function (err) {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', function (req, res) {
  var id = req.params.id;
  if (!_mongodb.ObjectID.isValid(id)) return res.status(404).send();
  _todo2.default.findById(id).then(function (todo) {
    if (!todo) return res.status(404).send();
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send(err);
  });
});

app.delete('/todos/:id', function (req, res) {
  var id = req.params.id;
  if (!_mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  _todo2.default.findByIdAndRemove(id).then(function (todo) {
    if (!todo) return res.status(404).send();
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send();
  });
});

app.patch('/todos/:id', function (req, res) {
  var id = req.params.id;
  var _req$body = req.body,
      text = _req$body.text,
      completed = _req$body.completed,
      completedAt = _req$body.completedAt;

  if (!_mongodb.ObjectID.isValid(id)) {
    return res.statue(404).send();
  }
  if (typeof completed === 'boolean' && completed) {
    completedAt = new Date().getTime();
  } else {
    completed = false;
    completedAt = null;
  }
  _todo2.default.findByIdAndUpdate(id, { $set: { text: text, completed: completed } }, { new: true }).then(function (todo) {
    if (!todo) {
      return res.status(404).send;
    }
    res.send({ todo: todo });
  }).catch(function (err) {
    res.status(400).send;
  });
});

app.listen(port, function () {
  console.log('Started up at port ' + port);
});

exports.default = app;