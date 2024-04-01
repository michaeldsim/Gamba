const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot exceed 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  balance: {
    type: Number,
    default: 100,
  },
  daily_last_claimed: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  wagered: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
})

// Middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

// Method to check if the entered password matches the hashed password in the database
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password)
}

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema)

module.exports = User
