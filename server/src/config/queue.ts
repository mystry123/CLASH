import { ConnectionOptions , DefaultJobOptions} from 'bullmq';

export const redisConnetion: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: 6379,
};



export const defaultQueueOptions:DefaultJobOptions = {
    removeOnComplete:{
        count:20,
        age:60*60*1000
    },
    attempts:3,
    backoff:{
        type:'exponential',
        delay:3000
    },
    removeOnFail:false,
};