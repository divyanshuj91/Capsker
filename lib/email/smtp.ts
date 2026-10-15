import nodemailer, { Transporter } from "nodemailer";

interface SmtpSettings {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    senderName: string;
    senderEmail: string;
}

export function createSmtpTransport(
    config: SmtpSettings
): Transporter {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.username,
            pass: config.password,
        },

        pool: true,
        maxConnections: 5,
        maxMessages: 100,

        rateDelta: 1000,
        rateLimit: 10,
    });
}

export async function sendTicketEmail({
    smtp,
    recipient,
    subject,
    body,
    attachment,
}: {
    smtp: SmtpSettings;
    recipient: string;
    subject: string;
    body: string;
    attachment: Buffer;
}) {
    const transporter = createSmtpTransport(smtp);

    try {
        const result = await transporter.sendMail({
            from: `"${smtp.senderName}" <${smtp.senderEmail}>`,
            to: recipient,
            subject,
            text: body,
            attachments: [
                {
                    filename: "hackathon-pass.png",
                    content: attachment,
                    contentType: "image/png",
                },
            ],
        });

        return result;
    } finally {
        await transporter.close();
    }
}