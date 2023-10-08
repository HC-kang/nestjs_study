import { QueueOptions } from 'bull';

export default (): QueueOptions => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});
