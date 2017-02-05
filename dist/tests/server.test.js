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

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _seed = require('./seed/seed');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeEach(_seed.populateUsers);
beforeEach(_seed.populateTodos);

describe('POST /todos', function () {
  it('should create a new todo', function (done) {
    var text = 'Test todo text';
    (0, _supertest2.default)(_index2.default).post('/todos').set('x-auth', _seed.users[0].tokens[0].token).send({ text: text }).expect(200).expect(function (res) {
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
    (0, _supertest2.default)(_index2.default).post('/todos').set('x-auth', _seed.users[0].tokens[0].token).send({ text: text }).expect(400).end(function (err, res) {
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
    (0, _supertest2.default)(_index2.default).get('/todos').set('x-auth', _seed.users[0].tokens[0].token).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todos.length).toBe(1);
    }).end(done);
  });
});

describe('GET /todos/:id', function () {
  it('should return todo doc', function (done) {
    var todoId = _seed.todos[0]._id.toHexString();
    (0, _supertest2.default)(_index2.default).get('/todos/' + todoId).set('x-auth', _seed.users[0].tokens[0].token).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todo.text).toBe(_seed.todos[0].text);
    }).end(done);
  });
  it('should not return todo doc created by other user', function (done) {
    var todoId = _seed.todos[1]._id.toHexString();
    (0, _supertest2.default)(_index2.default).get('/todos/' + todoId).set('x-auth', _seed.users[0].tokens[0].token).expect(404).end(done);
  });
  it('should return a 404 if todo is not found', function (done) {
    var hexId = new _mongodb.ObjectID().toHexString();
    (0, _supertest2.default)(_index2.default).get('/todos/' + hexId).set('x-auth', _seed.users[0].tokens[0].token).expect(404).end(done);
  });
  it('should return 404 for non-object ids', function (done) {
    (0, _supertest2.default)(_index2.default).get('/todos/123abc').set('x-auth', _seed.users[0].tokens[0].token).expect(404).end(done);
  });
});

describe('DELETE /todos/:id', function () {
  it('should remove a todo', function (done) {
    var hexId = _seed.todos[1]._id.toHexString();
    (0, _supertest2.default)(_index2.default).delete('/todos/' + hexId).set('x-auth', _seed.users[1].tokens[0].token).expect(200).expect(function (res) {
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
  it('should not remove a todo created by other user', function (done) {
    var hexId = _seed.todos[0]._id.toHexString();
    (0, _supertest2.default)(_index2.default).delete('/todos/' + hexId).set('x-auth', _seed.users[1].tokens[0].token).expect(404).end(function (err, res) {
      if (err) {
        return done(err);
      }
      _todo2.default.findById(hexId).then(function (todo) {
        (0, _expect2.default)(todo).toExist();
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
  it('should return 404 if todo not found', function (done) {
    var hexId = new _mongodb.ObjectID().toHexString();
    (0, _supertest2.default)(_index2.default).delete('/todos/' + hexId).set('x-auth', _seed.users[1].tokens[0].token).expect(404).end(done);
  });
  it('should return 404 if object id is invalid', function (done) {
    (0, _supertest2.default)(_index2.default).delete('/todos/123abc').set('x-auth', _seed.users[1].tokens[0].token).expect(404).end(done);
  });
});

describe('PATCH /todos/:id', function () {
  it('should update the todo', function (done) {
    var hexId = _seed.todos[0]._id.toHexString();
    var text = 'This should be the new text';
    (0, _supertest2.default)(_index2.default).patch('/todos/' + hexId).set('x-auth', _seed.users[0].tokens[0].token).send({
      completed: true,
      text: text
    }).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body.todo.text).toBe(text);
      (0, _expect2.default)(res.body.todo.completed).toBe(true);
      (0, _expect2.default)(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });
  it('should not update the todo created by other user', function (done) {
    var hexId = _seed.todos[0]._id.toHexString();
    var text = 'This should be the new text';
    (0, _supertest2.default)(_index2.default).patch('/todos/' + hexId).set('x-auth', _seed.users[1].tokens[0].token).send({
      completed: true,
      text: text
    }).expect(404).end(done);
  });
  it('should clear completedAt when todo is not completed', function (done) {
    var hexId = _seed.todos[1]._id.toHexString();
    var text = 'Some more new text';
    (0, _supertest2.default)(_index2.default).patch('/todos/' + hexId).set('x-auth', _seed.users[1].tokens[0].token).send({
      completed: false,
      text: text

    }).expect(200).expect(function (res) {
      var _res$body$todo = res.body.todo,
          text = _res$body$todo.text,
          completed = _res$body$todo.completed,
          completedAt = _res$body$todo.completedAt;

      (0, _expect2.default)(text).toBe(text);
      (0, _expect2.default)(completed).toBe(false);
      (0, _expect2.default)(completedAt).toNotExist();
    }).end(done);
  });
});

describe('GET /users/me', function () {
  it('should return user if authenticated', function (done) {
    (0, _supertest2.default)(_index2.default).get('/users/me').set('x-auth', _seed.users[0].tokens[0].token).expect(200).expect(function (res) {
      (0, _expect2.default)(res.body._id).toBe(_seed.users[0]._id.toHexString());
      (0, _expect2.default)(res.body.email).toBe(_seed.users[0].email);
    }).end(done);
  });
  it('should return a 401 if not authenticated', function (done) {
    (0, _supertest2.default)(_index2.default).get('/users/me').expect(401).expect(function (res) {
      (0, _expect2.default)(res.body).toEqual({});
    }).end(done);
  });
});

describe('POST /users', function () {
  it('should create a user', function (done) {
    var email = 'example@example.com';
    var password = '123mnb!';
    (0, _supertest2.default)(_index2.default).post('/users').send({ email: email, password: password }).expect(200).expect(function (res) {
      (0, _expect2.default)(res.headers['x-auth']).toExist();
      (0, _expect2.default)(res.body._id).toExist();
      (0, _expect2.default)(res.body.email).toBe(email);
    }).end(function (err) {
      if (err) {
        return done(err);
      }
      _user2.default.findOne({ email: email }).then(function (user) {
        (0, _expect2.default)(user).toExist();
        (0, _expect2.default)(user.password).toNotBe(password);
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
  it('should return validation errors if request invalid', function (done) {
    (0, _supertest2.default)(_index2.default).post('/users').send({
      email: 'and',
      password: '123'
    }).expect(400).end(done);
  });
  it('should not create user if email in use', function (done) {
    (0, _supertest2.default)(_index2.default).post('/users').send({
      email: _seed.users[0].email,
      password: 'Password123!'
    }).expect(400).end(done);
  });
});

describe('POST /users/login', function () {
  it('should login user and return auth token', function (done) {
    (0, _supertest2.default)(_index2.default).post('/users/login').send({
      email: _seed.users[1].email,
      password: _seed.users[1].password
    }).expect(200).expect(function (res) {
      (0, _expect2.default)(res.headers['x-auth']).toExist();
    }).end(function (err, res) {
      if (err) return done(err);
      _user2.default.findById(_seed.users[1]._id).then(function (user) {
        (0, _expect2.default)(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
  it('should reject invalid login', function (done) {
    (0, _supertest2.default)(_index2.default).post('/users/login').send({
      email: _seed.users[1].email,
      password: _seed.users[1].password + 1
    }).expect(400).expect(function (res) {
      (0, _expect2.default)(res.headers['x-auth']).toNotExist();
    }).end(function (err, res) {
      if (err) return done(err);
      _user2.default.findById(_seed.users[1]._id).then(function (user) {
        (0, _expect2.default)(user.tokens.length).toBe(1);
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
});

describe('DELETE /users/me/token', function () {
  it('should remove auth token on logout', function (done) {
    (0, _supertest2.default)(_index2.default).delete('/users/me/token').set('x-auth', _seed.users[0].tokens[0].token).expect(200).end(function (err, res) {
      if (err) return done(err);
      _user2.default.findById(_seed.users[0]._id).then(function (user) {
        (0, _expect2.default)(user.tokens.length).toBe(0);
        done();
      }).catch(function (err) {
        return done(err);
      });
    });
  });
});