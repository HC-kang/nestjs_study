import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

const { combine, timestamp, printf, colorize } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const logLevel = () => {
  const isDevelopment =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  return isDevelopment ? 'debug' : 'http';
};

const color = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray',
};

// Add colors to the logger
winston.addColors(color);

const customLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf((aLog) => {
    if (aLog.stack && aLog.stack[0] !== undefined) {
      return `[${aLog.timestamp}] [${aLog.level}]: ${aLog.message} \n ${aLog.stack}`;
    }
    return `[${aLog.timestamp}] [${aLog.level}]: ${aLog.message}`;
  }),
);

const consoleOnlyOptions = {
  handleExceptions: true,
  level: process.env.NODE_ENV === 'production' ? 'error' : 'silly',
  format: combine(colorize({ all: true })),
};

const transports = [
  new winston.transports.Console(consoleOnlyOptions),
  new winston.transports.File({
    level: 'error',
    filename: 'storage/log/nest-error.log',
    maxsize: 5 * 1024 * 1024,
    tailable: true,
  }),
  new winston.transports.File({
    level: 'info',
    filename: 'storage/log/nest-all.log',
    maxsize: 5 * 1024 * 1024,
    tailable: true,
  }),
];

export const CustomLogger = WinstonModule.createLogger({
  level: logLevel(),
  levels,
  format: customLogFormat,
  transports,
});
