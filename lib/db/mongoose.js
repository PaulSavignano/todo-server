import mongoose from 'mongoose'

const env = process.env.NODE_ENV || 'development'
console.log('env', env)
if (env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

export default mongoose
