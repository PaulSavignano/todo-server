import express from 'express'
import bodyParser from 'body-parser'
import { ObjectID } from 'mongodb'

import mongoose from './db/mongoose'
import Todo from './models/todo'
import User from './models/user'
import { authenticate } from './middleware/authenticate'

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos })
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(404).send()
  Todo.findById(id)
    .then((todo) => {
      if (!todo) return res.status(404).send()
      res.send({ todo })
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) return res.status(404).send()
      res.send({ todo })
    })
    .catch((err) => {
      res.status(400).send()
    })
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const { text, completed } = req.body
  if (!ObjectID.isValid(id)) {
    return res.statue(404).send()
  }
  if (typeof(completed) === 'boolean' && completed) {
    req.body.completedAt = new Date().getTime()
  } else {
    req.body.completed = false
    req.body.completedAt = null
  }
  Todo.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send
      }
      res.send({ todo })
    })
    .catch((err) => {
      res.status(400).send
    })
})

app.post('/users', (req, res) => {
  let { email, password } = req.body
  const user = new User({ email, password })
  user.save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then((token) => {
      res.header('x-auth', token).send(user)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

app.post('/users/login', (req, res) => {
  const { email, password } = req.body
  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => res.header('x-auth', token).send(user))
    })
    .catch((err) => res.status(400).send())
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

export default app
