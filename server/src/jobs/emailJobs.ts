import {Worker, Queue} from 'bullmq'
import { defaultQueueOptions, redisConnetion } from '../config/queue';
import { sendEmail } from '../config/mail';

export const emailQueueNmae = 'emailQueue';

interface EmailJobData {
    to: string;
    subject: string;
    body: any;
}
export const emailQueue = new Queue(emailQueueNmae, {
    connection: redisConnetion,
    defaultJobOptions: defaultQueueOptions,
});

// worker for processing email jobs

export const queueWorker = new Worker(emailQueueNmae, async job => {
   
    const data: EmailJobData = job.data;
    
    console.log('queue data',data);
    await sendEmail(data.to, data.subject, data.body);

},{
    connection: redisConnetion,
    concurrency: 5,
});

