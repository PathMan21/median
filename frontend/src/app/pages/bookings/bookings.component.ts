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
    <div class="bookings-page container animate-fade-in">
      <header class="page-header">
        <div class="header-main">
          <h1 class="font-display text-gradient">Mes Réservations</h1>
          <p class="muted">Gérez vos séances et retrouvez l'historique de vos émotions.</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-primary" (click)="openForm()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Nouvelle Séance
          </button>
        </div>
      </header>

      <!-- Advanced Stats (Glass Cards) -->
      <div class="stats-row" *ngIf="!loading && bookings.length > 0">
        <div class="stat-card glass">
          <span class="stat-val">{{ bookings.length }}</span>
          <span class="stat-label">Réservations</span>
        </div>
        <div class="stat-card glass accent">
          <span class="stat-val">{{ getTotalSpent() | number:'1.2-2' }} €</span>
          <span class="stat-label">Investissement Passion</span>
        </div>
      </div>

      <!-- Modern Loader -->
      <div *ngIf="loading" class="modern-loader">
        <div class="loader-pulse shadow-neon"></div>
        <p>Récupération de vos billets...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && bookings.length === 0" class="empty-state glass">
        <div class="empty-icon shadow-neon">🎟️</div>
        <h3>Aucun billet émis</h3>
        <p class="muted">Vous n'avez pas encore de réservations planifiées.</p>
        <button class="btn btn-outline btn-sm" (click)="openForm()">Réserver ma première séance</button>
      </div>

      <!-- Modern Table Layout -->
      <div class="bookings-grid" *ngIf="!loading && bookings.length > 0">
        <div class="booking-card glass" *ngFor="let b of bookings">
          <div class="card-header">
            <div class="card-title-section">
              <h3 class="film-title">{{ b.film?.title || '—' }}</h3>
              <p class="cinema-location">{{ b.cinema?.name || '—' }} • {{ b.cinema?.city || '—' }}</p>
            </div>
            <app-badge [status]="b.status" class="card-badge"></app-badge>
          </div>

          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">📅 Date</span>
                <span class="info-value">{{ b.bookingDate | date:'dd MMM yyyy' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏰ Horaire</span>
                <span class="info-value">{{ b.bookingDate | date:'HH:mm' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🎫 Places</span>
                <span class="info-value">{{ b.numberOfSeats }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">💰 Montant</span>
                <span class="info-value-price">{{ b.totalPrice | number:'1.2-2' }}€</span>
              </div>
            </div>

            <div class="card-details" *ngIf="auth.isAdmin()">
              <small class="booking-id">#{{ b.id }} • Utilisateur: {{ b.user?.login || b.userId }}</small>
            </div>
          </div>

          <div class="card-footer">
            <button
              class="btn btn-danger btn-sm"
              *ngIf="b.status !== 'CANCELLED'"
              (click)="cancel(b)"
            >
              ✕ Annuler
            </button>
            <div class="spacer"></div>
          </div>
        </div>
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
    </div>
  `,
  styles: [`
    .bookings-page {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .muted { color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem 2rem;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .stat-card.accent { 
      background: linear-gradient(135deg, #fff1f2, #ffe4e6); /* Soft Rose */
      border-color: #fecdd3; 
    }

    .stat-val {
      font-size: 1.5rem;
      font-weight: 800;
      font-family: var(--font-display);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .booking-card {
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-glass-heavy);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .booking-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent-primary);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .card-title-section {
      flex: 1;
    }

    .film-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .cinema-location {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .card-badge {
      padding: 0.4rem 0.8rem;
    }

    .card-body {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .info-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .info-value-price {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent-primary);
    }

    .card-details {
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
    }

    .booking-id {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .card-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .spacer {
      flex: 1;
    }

    .btn-danger {
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.08);
    }

    .empty-state {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .empty-icon {
      font-size: 3rem;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.03);
      border-radius: 50%;
    }

    .modern-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 6rem;
      color: var(--text-muted);
    }

    .loader-pulse {
      width: 60px;
      height: 60px;
      background: var(--accent-primary);
      border-radius: 50%;
      animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .bookings-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .info-grid { grid-template-columns: 1fr; }
      .card-footer { flex-wrap: wrap; }
    }
  `]
})
export class BookingsPageComponent implements OnInit {
  auth = inject(AuthService);
  private bookingSvc = inject(BookingService);
  private filmSvc = inject(FilmService);
  private cinemaSvc = inject(CinemaService);

  bookings: Booking[] = [];
  films: Film[] = [];
  cinemas: Cinema[] = [];
  loading = true;

  formOpen = false;
  formLoading = false;
  formError = '';

  ngOnInit(): void {
    forkJoin({
      films: this.filmSvc.getAll(),
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

  getTotalSpent(): number {
    return this.bookings
      .filter(b => b.status !== 'CANCELLED')
      .reduce((acc, b) => acc + b.totalPrice, 0);
  }

  openForm(): void { this.formError = ''; this.formOpen = true; }

  onSave(req: any): void {
    this.formLoading = true;
    this.formError = '';
    this.bookingSvc.create(req).subscribe({
      next: () => { this.formLoading = false; this.formOpen = false; this.load(); },
      error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
    });
  }

  confirm(b: Booking): void {
    this.bookingSvc.confirm(b.id).subscribe({ next: () => this.load(), error: () => { } });
  }

  cancel(b: Booking): void {
    if (!confirm('Annuler cette réservation ?')) return;
    this.bookingSvc.cancel(b.id).subscribe({ next: () => this.load(), error: () => { } });
  }
}

