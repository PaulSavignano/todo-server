import express from 'express'
import bodyParser from 'body-parser'
import { ObjectID } from 'mongodb'

import mongoose from './db/mongoose'
import Todo from './models/todo'
import User from './models/user'

const app = express()

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

app.listen(3000, () => {
  console.log('Started on port 3000')
})

export default app
