const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});


const logger = winston.createLogger({
  level: config.log_level,
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.splat(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp}: ${level}: ${message}`)
  ),
  transports: [
    //  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    //  new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, className = "", methodName = "", CID = "", topicId = "", threadId = "", lineNumber = "" }) =>
            ` ${timestamp} | ${level} | ${className} | ${methodName} | ${lineNumber} | ${message} | ${CID} | ${topicId} | ${threadId}`
        )
      )
    })
  ]
});

module.exports = logger;