import { Queue } from 'bullmq'
import dotenv from 'dotenv'
import IORedis from 'ioredis'

dotenv.config()

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null  // Muy importante para BullMQ
})

export const emailQueue = new Queue('email-queue', { connection })
