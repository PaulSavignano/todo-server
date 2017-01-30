'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _mongodb = require('mongodb');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _todo = require('../models/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var todos = [{
  _id: new _mongodb.ObjectID(),
  text: 'First test todo'
}, {
  _id: new _mongodb.ObjectID(),
  text: 'Second test todo'
}];

beforeEach(function (done) {
  _todo2.default.remove({}).then(function () {
    return _todo2.default.insertMany(todos);
  }).then(function () {
    return done();
  });
});

describe('POST /todos', function () {
  it('should create a new todo', function (done) {
    var text = 'Test todo text';
    (0, _supertest2.default)(_index2.default).post('/todos').send({ text: text }).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.text).toBe(text);
    }).end(function (err, res) {
      if (err) done(err);
      _todo2.default.find({ text: text }).then(function (todos) {
        (0, _expect2.default)(todos.length).toBe(1);
        (0, _expect2.default)(todos[0].text).toBe(text);
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
  it('should not create todo with invalid body data', function (done) {
    var text = {};
    (0, _supertest2.default)(_index2.default).post('/todos').send({ text: text }).expect(400).end(function (err, res) {
      if (err) done(err);
      _todo2.default.find().then(function (todos) {
        epect(todos.length).toBe(2);
        done();
      }).catch(function (err) {
        return done();
      });
    });
  });
});

describe('GET /todos', function () {
  it('should get all todos', function (done) {
    (0, _supertest2.default)(_index2.default).get('/todos').expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todos.length).toBe(2);
    }).end(done);
  });
});

describe('GET /todos/:id', function () {
  it('should return todo doc', function (done) {
    var todoId = todos[0]._id.toHexString();
    (0, _supertest2.default)(_index2.default).get('/todos/' + todoId).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });
  it('should return a 404 if todo is not found', function (done) {
    var hexId = new _mongodb.ObjectID().toHexString();
    (0, _supertest2.default)(_index2.default).get('/todos/' + hexId).expect(404).end(done);
  });
  it('should return 404 for non-object ids', function (done) {
    (0, _supertest2.default)(_index2.default).get('/todos/123abc').expect(404).end(done);
  });
});

describe('DELETE /todos/:id', function () {
  it('should remove a todo', function (done) {
    var hexId = todos[0]._id.toHexString();
    (0, _supertest2.default)(_index2.default).delete('/todos/' + hexId).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todo._id).toBe(hexId);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }
      _todo2.default.findById(hexId).then(function (todo) {
        (0, _expect2.default)(todo).toNotExist();
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
  it('should return 404 if todo not found', function (done) {
    var hexId = new _mongodb.ObjectID().toHexString();
    (0, _supertest2.default)(_index2.default).delete('/todos/' + hexId).expect(404).end(done);
  });
  it('should return 404 if object id is invalid', function (done) {
    (0, _supertest2.default)(_index2.default).delete('/todos/123abc').expect(404).end(done);
  });
});