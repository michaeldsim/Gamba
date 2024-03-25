const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Custom print format for console
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Logger configuration
const logConfiguration = {
    // Format for log entries
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            level: 'info', // Minimum level to log to console
            format: combine(
                colorize(), // Colorize log levels
                myFormat
            )
        }),
        // File transports
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error', // Only log errors here
            format: combine(
                myFormat
            )
        }),
        new winston.transports.File({
            filename: 'logs/combined.log', // Log everything here
        })
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;
