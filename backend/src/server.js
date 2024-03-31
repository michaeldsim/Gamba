require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const logger  = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes')
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8080', // Adjust to your frontend's origin
  credentials: true, // This is important for cookies
}));
app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport); // Passport config

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected')
  })
  .catch(err => logger.error(err));

// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});