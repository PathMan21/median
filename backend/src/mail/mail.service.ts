import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendValidationMail(to: string, prenom: string): Promise<void> {
    const html = fs.readFileSync(__dirname + '/assets/template_mail.html', 'utf8')
      .replace('{{prenom}}', prenom); 
      
    const mailOptions = {
      from: 'MedianFilm@email.com',
      to,                            
      subject: 'Sending Email using Node.js',
      html,                         
    };

    await this.transporter.sendMail(mailOptions); 
  }
}