// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: `"My App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(mailOptions , function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
