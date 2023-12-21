import * as WinstonCloudwatch from 'winston-cloudwatch';

export const cloudwatchHelper = (options: any) =>
  new WinstonCloudwatch({
    logGroupName: options.AWS_LOG_GROUP_NAME,
    logStreamName: options.AWS_LOG_STREAM_NAME,
    awsOptions: {
      credentials: {
        accessKeyId: options.AWS_LOG_ACCESS_KEY_ID,
        secretAccessKey: options.AWS_LOG_SECRET_ACCESS_KEY,
      },
    },
    awsRegion: options.AWS_LOG_REGION,
    retentionInDays: 14,
    messageFormatter: (log) => {
      const messageParts = [
        `[${log.timestamp}]`,
        log.data.correlationId ? ` [${log.data.correlationId}]` : '',
        `${log.level.toUpperCase()}`,
        log.data.sourceClass ? ` [${log.data.sourceClass}]` : '',
        log.message,
        log.data.error || '',
        log.data.durationMs !== undefined ? ` +${log.data.durationMs}ms` : '',
        log.data.stack ? ` - ${log.data.stack}` : '',
        log.data.props
          ? `\n - Props: ${JSON.stringify(log.data.props, null, 4)}`
          : '',
      ];
      return messageParts.join(' ');
    },
  });
