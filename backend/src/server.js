require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const logger  = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
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
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/user', userRoutes);

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});