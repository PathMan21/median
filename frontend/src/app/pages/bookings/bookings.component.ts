import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../core/services/booking.service';
import { FilmService } from '../../core/services/film.service';
import { CinemaService } from '../../core/services/cinema.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingFormComponent } from '../../features/bookings/booking-form.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { Booking } from '../../core/models/booking.model';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [CommonModule, BookingFormComponent, BadgeComponent],
  template: `
    <div class="top-bar">
      <div>
        <div class="section-title">{{ auth.isAdmin() ? 'Toutes les réservations' : 'Mes réservations' }}</div>
        <div class="section-sub">Historique</div>
      </div>
      <button class="btn btn-gold btn-sm" (click)="openForm()">+ Réserver</button>
    </div>

    <div *ngIf="loading" class="loading">Chargement</div>
    <div *ngIf="!loading && bookings.length === 0" class="empty">
      <div class="empty-icon">🎟️</div>
      Aucune réservation pour l'instant
    </div>

    <div class="table-wrap" *ngIf="!loading && bookings.length > 0">
      <table>
        <thead>
          <tr>
            <th *ngIf="auth.isAdmin()">ID</th>
            <th>Film</th>
            <th>Cinéma</th>
            <th *ngIf="auth.isAdmin()">Utilisateur</th>
            <th>Date</th>
            <th>Sièges</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of bookings">
            <td *ngIf="auth.isAdmin()" class="dim">#{{ b.id }}</td>
            <td><span class="film-title">{{ b.film?.title || '—' }}</span></td>
            <td>
              {{ b.cinema?.name || '—' }}
              <span class="city" *ngIf="b.cinema?.city">{{ b.cinema!.city }}</span>
            </td>
            <td *ngIf="auth.isAdmin()">{{ b.user?.login || b.userId }}</td>
            <td>{{ b.bookingDate | date:'dd/MM/yy HH:mm' }}</td>
            <td>{{ b.numberOfSeats }}</td>
            <td>{{ b.totalPrice | number:'1.2-2' }} €</td>
            <td><app-badge [status]="b.status"></app-badge></td>
            <td>
              <div class="actions">
                <button
                  class="btn btn-outline btn-sm"
                  *ngIf="b.status === 'PENDING'"
                  (click)="confirm(b)"
                >✓</button>
                <button
                  class="btn btn-red btn-sm"
                  *ngIf="b.status !== 'CANCELLED'"
                  (click)="cancel(b)"
                >✕</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <app-booking-form
      [isOpen]="formOpen"
      [films]="films"
      [cinemas]="cinemas"
      [userId]="auth.currentUser()!.id"
      [loading]="formLoading"
      [error]="formError"
      (save)="onSave($event)"
      (cancel)="formOpen = false"
    ></app-booking-form>
  `,
  styles: [`
    .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .table-wrap { overflow-x: auto; }
    .film-title { font-family: var(--font-display); font-size: 0.95rem; }
    .city { display: block; color: var(--text-dim); font-size: 11px; margin-top: 2px; }
    .dim  { color: var(--text-dim); }
    .actions { display: flex; gap: 0.5rem; }
  `]
})
export class BookingsPageComponent implements OnInit {
  auth = inject(AuthService);
  private bookingSvc = inject(BookingService);
  private filmSvc    = inject(FilmService);
  private cinemaSvc  = inject(CinemaService);

  bookings: Booking[] = [];
  films: Film[]       = [];
  cinemas: Cinema[]   = [];
  loading = true;

  formOpen    = false;
  formLoading = false;
  formError   = '';

  ngOnInit(): void {
    forkJoin({
      films:   this.filmSvc.getAll(),
      cinemas: this.cinemaSvc.getAll(),
    }).subscribe({ next: ({ films, cinemas }) => { this.films = films; this.cinemas = cinemas; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    const obs = this.auth.isAdmin()
      ? this.bookingSvc.getAll()
      : this.bookingSvc.getByUser(this.auth.currentUser()!.id);

    obs.subscribe({
      next: b => { this.bookings = b; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void { this.formError = ''; this.formOpen = true; }

  onSave(req: any): void {
    this.formLoading = true;
    this.formError   = '';
    this.bookingSvc.create(req).subscribe({
      next: () => { this.formLoading = false; this.formOpen = false; this.load(); },
      error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
    });
  }

  confirm(b: Booking): void {
    this.bookingSvc.confirm(b.id).subscribe({ next: () => this.load(), error: () => {} });
  }

  cancel(b: Booking): void {
    if (!confirm('Annuler cette réservation ?')) return;
    this.bookingSvc.cancel(b.id).subscribe({ next: () => this.load(), error: () => {} });
  }
}
