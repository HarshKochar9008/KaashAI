import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });

export const generationQueue = new Queue('exam-generation', {
  connection: connection as any,
  // Cast to 'any' so we can use runtime-supported options like `timeout`
  // even if the installed bullmq types don't expose them.
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    timeout: 5 * 60 * 1000, // 5 minutes
    removeOnComplete: true,
    removeOnFail: false,
  } as any,
});
