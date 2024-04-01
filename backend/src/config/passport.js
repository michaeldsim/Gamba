const JwtStrategy = require('passport-jwt').Strategy
const User = require('../models/User') // Ensure this path is correct
require('dotenv').config()

module.exports = passport => {
  const cookieExtractor = function (req) {
    let token = null
    if (req && req.cookies) {
      token = req.cookies['jwt'] // The name 'jwt' is your cookie's name
    }
    return token
  }

  const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
  }

  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).select('-password')
        if (user) {
          return done(null, user) // User found
        } else {
          return done(null, false) // User not found
        }
      } catch (err) {
        return done(err, false) // An error occurred
      }
    }),
  )
}
