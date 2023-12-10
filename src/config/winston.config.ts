import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as WinstonCloudwatch from 'winston-cloudwatch';
import * as dotenv from 'dotenv';

// main.ts에서 winstonLogger를 app보다 먼저 호출하므로, configService를 사용할 수 없다.
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

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

const color = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray',
};

const logLevel = () => {
  return process.env.NODE_ENV === 'production' ? 'debug' : 'http';
};

// Add colors to the logger
winston.addColors(color);

const customLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf((aLog) => {
    const nestReqId = aLog.alsCtx?.nestReqId;
    const nestReqIdStr = nestReqId //
      ? `[${nestReqId}]`
      : '';
    const stackStr =
      aLog.stack && aLog.stack[0] !== undefined //
        ? ` \n ${aLog.stack}`
        : '';
    return `[${aLog.timestamp}] [${aLog.level}] ${nestReqIdStr}: ${aLog.message}${stackStr}`;
  }),
);

const consoleOnlyOptions = {
  handleExceptions: true,
  level: process.env.NODE_ENV === 'production' ? 'error' : 'silly',
  format: combine(colorize({ all: true })),
};

// const cloudwatchConfig = {
//   logGroupName: process.env.AWS_LOG_GROUP_NAME,
//   logStreamName: process.env.AWS_LOG_STREAM_NAME,
//   awsOptions: {
//     credentials: {
//       accessKeyId: process.env.AWS_LOG_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_LOG_SECRET_ACCESS_KEY,
//       region: process.env.AWS_LOG_REGION,
//     },
//   },
//   retentionInDays: 14,
//   messageFormatter: (aLog) => {
//     const { level, message, alsCtx } = aLog;
//     const nestReqId = alsCtx?.nestReqId;
//     const nestReqIdStr = nestReqId ? `[${nestReqId}]` : '[]';
//     return `[${level}] ${nestReqIdStr}: ${message}`;
//   },
// };

// const cloudwatchHelper = new WinstonCloudwatch(cloudwatchConfig);

const transports = [
  // cloudwatchHelper,
  new winston.transports.Console(consoleOnlyOptions),
  new winston.transports.File({
    level: 'error',
    filename: 'storage/logs/nest-error.log',
    maxsize: 20 * 1024 * 1024,
    tailable: true,
    zippedArchive: true,
    maxFiles: 14,
  }),
  new winston.transports.File({
    // level: 'info',
    level: 'silly',
    filename: 'storage/logs/nest-all.log',
    maxsize: 20 * 1024 * 1024,
    tailable: true,
    zippedArchive: true,
    maxFiles: 14,
  }),
];

export const WinstonLogger = WinstonModule.createLogger({
  level: logLevel(),
  levels,
  format: customLogFormat,
  transports,
});
