import { MongoClient, ObjectID } from 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err)
  }
  console.log('Connected to MongoDB server')
  // db.collection('Todos').find({
  //   _id: new ObjectID("588938f36928d704c636a385")
  // }).toArray().then((docs) => {
  //   console.log('todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   if (err) {
  //     return console.log('Unable to fetch todos', err)
  //   }
  // })

  db.collection('Todos').find().count()
    .then((count) => {
      console.log(`Todos count: ${count}`)
    }, (err) => {
      if (err) {
        return console.log('Unable to fetch todos', err)
      }
    })
  //db.close()
})
