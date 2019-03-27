/**
 * @file Logger
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logsPath = require('path').join(__dirname, '../logs');

const logger = createLogger({
   level: 'info',
   levels: {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
   },
   format: format.combine(format.timestamp(), format.json()),
   transports: [
      new transports.DailyRotateFile({
         timestamp: true,
         dirname: logsPath,
         level: 'error',
         filename: 'application-errors-%DATE%.log',
         datePattern: 'YYYY-MM-DD', // Rotate log file every day
         zippedArchive: true, // gzip archived logs
         maxFiles: '14d', // Remove all logs that are older than ...
      }),
      new transports.DailyRotateFile({
         dirname: logsPath,
         level: 'verbose',
         filename: 'application-verbose-%DATE%.log',
         datePattern: 'YYYY-MM-DD', // Rotate log file every day
         zippedArchive: true, // gzip archived logs
         maxFiles: '14d', // Remove all logs that are older than ...
      }),
   ],
});

// Add special debug log for developing
if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new transports.DailyRotateFile({
         dirname: logsPath,
         level: 'debug',
         filename: 'application-debug-%DATE%.log',
         datePattern: 'YYYY-MM-DD', // Rotate log file every day
         zippedArchive: true, // gzip archived logs
         maxFiles: '14d', // Remove all logs that are older than ...
      }),
   );
}

logger.debug('Utility:Logger start.');

export default logger;
