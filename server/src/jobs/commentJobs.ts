import { Worker, Queue, Job } from "bullmq";
import { defaultQueueOptions, redisConnetion } from "../config/queue";
import { sendEmail } from "../config/mail";
import prisma from "../config/database";

export const commentQueueName = "votingQueue";

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnetion,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// worker for processing email jobs

export const queueWorker = new Worker(
  commentQueueName,
  async (job: Job) => {
    const data = job.data;

    await prisma.clashComment.create({
      data: {
        clash_id: Number(data?.id),
        comment: data?.comment,
      },
    });
  },
  {
    connection: redisConnetion,
    concurrency: 5,
  }
);
