import { Queue } from "bullmq";
import { redis } from "./redis";

export interface EmailJobData {
    eventId: string;
    participantId: string;
    templateId: string;
    emailLogId: string;
}

export const emailQueue = new Queue<EmailJobData>("capsker-email", {
    connection: redis,

    defaultJobOptions: {
        attempts: 5,

        backoff: {
            type: "exponential",
            delay: 5000,
        },

        removeOnComplete: {
            age: 60 * 60,
            count: 1000,
        },

        removeOnFail: {
            age: 24 * 60 * 60,
        },
    },
});