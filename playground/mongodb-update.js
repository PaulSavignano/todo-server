import { MongoClient, ObjectID } from 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB', err)
  }
  console.log('Connected to MongoDB')

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('588a71dd7e517909c24f689e')
  }, {
    $set: {
      age: 2
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })
})
