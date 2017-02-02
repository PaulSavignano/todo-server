import mongoose, { Schema } from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  const { _id, email } = userObject
  return { _id, email }
}

UserSchema.methods.generateAuthToken = function() {
  const user = this
  const access = 'auth'
  const token = jwt.sign({ _id: user._id.toHexString(), access}, 'abc123').toString()
  user.tokens.push({
    access,
    token
  })
  return user.save()
    .then(() => {
      return token
    })
}

UserSchema.statics.findByToken = function(token) {
  const User = this
  let decoded
  try {
    decoded = jwt.verify(token, 'abc123')
  } catch(err) {
    return Promise.reject()
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

const User = mongoose.model('User', UserSchema)

export default User
