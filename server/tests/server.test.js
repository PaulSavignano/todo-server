import expect from 'expect'
import request from 'supertest'

import app from '../server'
import Todo from '../models/todo'

beforeEach((done) => {
  Todo.remove({}).then(() => done())
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
        Todo.find().then((todos) => {
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
          epect(todos.length).toBe(0)
          done()
        }).catch((err) => done())
      })
  })
})