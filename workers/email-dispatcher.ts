import "dotenv/config";

import { Worker } from "bullmq";

import { redis } from "@/lib/queue/redis";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto/encryption";
import { interpolateEmail } from "@/lib/email/templates";
import { sendTicketEmail } from "@/lib/email/smtp";
import { renderTicket } from "@/lib/ticket/renderer";

import type { EmailJobData } from "@/lib/queue/email.queue";

const worker = new Worker<EmailJobData>(
    "capsker-email",

    async (job) => {
        const {
            eventId,
            participantId,
            templateId,
            emailLogId,
        } = job.data;

        await prisma.emailLog.update({
            where: {
                id: emailLogId,
            },
            data: {
                status: "PROCESSING",
                processingAt: new Date(),
            },
        });

        try {
            const emailLog =
                await prisma.emailLog.findUnique({
                    where: {
                        id: emailLogId,
                    },
                });

            if (!emailLog) {
                throw new Error("Email log not found");
            }

            const participant =
                await prisma.participant.findFirst({
                    where: {
                        id: participantId,
                        team: {
                            eventId,
                        },
                    },
                    include: {
                        team: true,
                    },
                });

            if (!participant) {
                throw new Error("Participant not found");
            }

            const template =
                await prisma.assetTemplate.findFirst({
                    where: {
                        id: templateId,
                        eventId,
                        type: "TICKET",
                    },
                });

            if (!template) {
                throw new Error("Ticket template not found");
            }

            const event =
                await prisma.event.findUnique({
                    where: {
                        id: eventId,
                    },
                });

            if (!event) {
                throw new Error("Event not found");
            }

            const smtp =
                await prisma.smtpConfig.findFirst({
                    where: {
                        userId: event.userId,
                    },
                });

            if (!smtp) {
                throw new Error(
                    "No SMTP configuration found"
                );
            }

            const password = decrypt(smtp.password);

            const placeholders =
                template.fieldConfig as any;

            const ticket =
                await renderTicket({
                    width: template.width,
                    height: template.height,
                    baseImageUrl: template.baseImageUrl,
                    placeholders,
                    eventId,
                    participant: {
                        id: participant.id,
                        name: participant.name,
                        email: participant.email,
                        role: participant.role,
                        institution:
                            participant.institution,
                        teamName: participant.team.name,
                        teamNumber:
                            participant.team.teamNumber,
                    },
                });

            const subject = interpolateEmail(
                emailLog.subject,
                {
                    name: participant.name,
                    teamName: participant.team.name,
                    role: participant.role,
                    institution:
                        participant.institution,
                    teamNumber:
                        participant.team.teamNumber,
                }
            );

            const emailBody = interpolateEmail(
                emailLog.body,
                {
                    name: participant.name,
                    teamName: participant.team.name,
                    role: participant.role,
                    institution:
                        participant.institution,
                    teamNumber:
                        participant.team.teamNumber,
                }
            );

            const result =
                await sendTicketEmail({
                    smtp: {
                        host: smtp.host,
                        port: smtp.port,
                        secure: smtp.secure,
                        username: smtp.username,
                        password,
                        senderName: smtp.senderName,
                        senderEmail: smtp.senderEmail,
                    },

                    recipient:
                        participant.email,

                    subject,

                    body: emailBody,

                    attachment: ticket,
                });

            await prisma.emailLog.update({
                where: {
                    id: emailLogId,
                },
                data: {
                    status: "SENT",
                    sentAt: new Date(),
                    providerMessageId:
                        result.messageId,
                    errorMessage: null,
                },
            });

            return {
                success: true,
                messageId: result.messageId,
            };
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown email error";

            await prisma.emailLog.update({
                where: {
                    id: emailLogId,
                },
                data: {
                    status: "FAILED",
                    errorMessage: message,
                },
            });

            throw error;
        }
    },

    {
        connection: redis,

        concurrency: 10,

        limiter: {
            max: 30,
            duration: 60_000,
        },
    }
);

worker.on("completed", (job) => {
    console.log(
        `Email job completed: ${job.id}`
    );
});

worker.on("failed", (job, error) => {
    console.error(
        `Email job failed: ${job?.id}`,
        error
    );
});

async function shutdown() {
    console.log("Shutting down email worker...");

    await worker.close();
    await prisma.$disconnect();
    await redis.quit();

    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(
    "Capsker email worker is running..."
);