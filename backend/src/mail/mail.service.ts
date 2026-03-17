import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  private readTemplate(filename: string): string {
    const possiblePaths = [
      path.join(__dirname, 'assets', filename),
      path.join(__dirname, '..', 'mail', 'assets', filename),
      path.join(process.cwd(), 'src', 'mail', 'assets', filename),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    }
    return '';
  }

  async sendWelcomeMail(to: string, login: string, verificationToken: string): Promise<void> {
    const appName = 'Median Film';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const validationUrl = `${frontendUrl}/verify/${verificationToken}`;

    let html = this.readTemplate('template_mail.html');

    if (!html) {
      html = `
        <h1>Bienvenue sur ${appName} !</h1>
        <p>Bonjour <strong>${login}</strong>,</p>
        <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <p><a href="${validationUrl}">Activer mon compte</a></p>
      `;
    }

    html = html
      .replace(/{{prenom}}/g, login)
      .replace(/{{app_name}}/g, appName)
      .replace(/{{validation_url}}/g, validationUrl);

    try {
      await this.transporter.sendMail({
        from: `"${appName}" <${process.env.MAIL_SEND || 'noreply@medianfilm.com'}>`,
        to,
        subject: `Activez votre compte ${appName}`,
        html,
      });
      this.logger.log(`Mail de vérification envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi mail à ${to} : ${error.message}`);
    }
  }

  async sendBookingConfirmation(params: {
    to: string;
    login: string;
    bookingId: number;
    filmTitle: string;
    filmGenre: string;
    filmDuration: number;
    filmDescription: string;
    filmPosterUrl: string;
    cinemaName: string;
    cinemaCity: string;
    bookingDate: Date;
    numberOfSeats: number;
    totalPrice: number;
  }): Promise<void> {
    const appName = 'Median Film';

    const h = Math.floor(params.filmDuration / 60);
    const m = params.filmDuration % 60;
    const durationFormatted = `${h}h${m.toString().padStart(2, '0')}`;

    const dateFormatted = new Date(params.bookingDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let html = this.readTemplate('template_booking.html');

    if (!html) {
      html = `
        <h1>Réservation confirmée !</h1>
        <p>Bonjour ${params.login}, votre réservation pour ${params.filmTitle} est confirmée.</p>
        <p>Date : ${dateFormatted} | Places : ${params.numberOfSeats} | Total : ${params.totalPrice}€</p>
        <p>Numéro de réservation : #${params.bookingId}</p>
      `;
    }

    html = html
      .replace(/{{login}}/g, params.login)
      .replace(/{{bookingId}}/g, String(params.bookingId))
      .replace(/{{filmTitle}}/g, params.filmTitle)
      .replace(/{{filmGenre}}/g, params.filmGenre)
      .replace(/{{filmDuration}}/g, durationFormatted)
      .replace(/{{filmDescription}}/g, params.filmDescription)
      .replace(/{{posterUrl}}/g, params.filmPosterUrl || '')
      .replace(/{{cinemaName}}/g, params.cinemaName)
      .replace(/{{cinemaCity}}/g, params.cinemaCity)
      .replace(/{{bookingDate}}/g, dateFormatted)
      .replace(/{{numberOfSeats}}/g, String(params.numberOfSeats))
      .replace(/{{totalPrice}}/g, params.totalPrice.toFixed(2));

    try {
      await this.transporter.sendMail({
        from: `"${appName}" <${process.env.MAIL_SEND || 'noreply@medianfilm.com'}>`,
        to: params.to,
        subject: `🎬 Votre réservation pour ${params.filmTitle} est confirmée !`,
        html,
      });
      this.logger.log(`Mail de réservation envoyé à ${params.to}`);
    } catch (error) {
      this.logger.error(`Échec envoi mail réservation à ${params.to} : ${error.message}`);
    }
  }
}