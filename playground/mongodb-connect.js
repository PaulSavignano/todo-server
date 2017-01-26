import { MongoClient, ObjectID } from 'mongodb'


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')
  // db.collection('Users').insertOne({
  //   name: 'Paul',
  //   age: 40,
  //   location: 'Carlsbad'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //   console.log(result.ops[0]._id.getTimestamp())
  // })
  db.close()
})
