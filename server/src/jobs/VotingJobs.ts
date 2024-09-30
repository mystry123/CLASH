import { Worker, Queue, Job } from "bullmq";
import { defaultQueueOptions, redisConnetion } from "../config/queue";
import { sendEmail } from "../config/mail";
import prisma from "../config/database";

export const votingQueueName = "votingQueue";

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnetion,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// worker for processing email jobs

export const queueWorker = new Worker(
  votingQueueName,
  async (job: Job) => {
    const data = job.data;

    await prisma.clashItem.update({
      where: {
        id: Number(data.clashItemId),
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  },
  {
    connection: redisConnetion,
    concurrency: 5,
  }
);
