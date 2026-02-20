import nodemailer, { Transporter } from 'nodemailer';
import IEmailService from '../interfaces/IServices/IEmailService';

export default class EmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text: body,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendBulkEmail(recipients: string[], subject: string, body: string): Promise<void> {
        await Promise.all(recipients.map((recipient) => this.sendEmail(recipient, subject, body)));
    }
}