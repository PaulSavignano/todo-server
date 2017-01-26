import { MongoClient, ObjectID } from 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err)
  }
  console.log('Connected to MongoDB server')

  //deleteMany
  // db.collection('Users').deleteMany({ name: 'Paul' })
  //   .then((result) => {
  //     console.log(result)
  //   })

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Eat lunch' })
  //   .then((result) => {
  //     console.log(result)
  //   })

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ completed: false })
  //   .then((result) => {
  //     console.log(result)
  //   })

})
