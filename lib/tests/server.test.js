import expect from 'expect'
import request from 'supertest'
import { ObjectID } from 'mongodb'

import app from '../index'
import Todo from '../models/todo'

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  completed: false,
  completedAt: 123
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text'
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) done(err)
        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((err) => done(err))
      })
  })
  it('should not create todo with invalid body data', (done) => {
    const text = {}
    request(app)
      .post('/todos')
      .send({ text })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)
        Todo.find().then((todos) => {
          epect(todos.length).toBe(2)
          done()
        }).catch((err) => done())
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    const todoId = todos[0]._id.toHexString()
    request(app)
      .get(`/todos/${todoId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
  it('should return a 404 if todo is not found', (done) => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toNotExist()
            done()
          })
          .catch((err) => done(err))
      })
  })
  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const hexId = todos[0]._id.toHexString()
    const text = 'This should be the new text'
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })
  it('should clear completedAt when todo is not completed', (done) => {
    const hexId = todos[1]._id.toHexString()
    const text = 'Some more new text'
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text,

      })
      .expect(200)
      .expect((res) => {
        const { text, completed, completedAt } = res.body.todo
        expect(text).toBe(text)
        expect(completed).toBe(false)
        expect(completedAt).toNotExist()
      })
      .end(done)
  })
})
