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
      <div class="table-container glass" *ngIf="!loading && bookings.length > 0">
        <table class="modern-table">
          <thead>
            <tr>
              <th *ngIf="auth.isAdmin()">ID</th>
              <th>Film & Cinéma</th>
              <th>Date & Heure</th>
              <th *ngIf="auth.isAdmin()">Utilisateur</th>
              <th>Sièges</th>
              <th>Montant</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings" class="table-row">
              <td *ngIf="auth.isAdmin()" class="id-cell">#{{ b.id }}</td>
              <td>
                <div class="film-info">
                  <div class="film-name font-display">{{ b.film?.title || '—' }}</div>
                  <div class="cinema-name muted">{{ b.cinema?.name || '—' }} ({{ b.cinema?.city || '—' }})</div>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <span class="date">{{ b.bookingDate | date:'dd MMM yyyy' }}</span>
                  <span class="time">{{ b.bookingDate | date:'HH:mm' }}</span>
                </div>
              </td>
              <td *ngIf="auth.isAdmin()">{{ b.user?.login || b.userId }}</td>
              <td>
                <span class="seats-badge">{{ b.numberOfSeats }}</span>
              </td>
              <td class="price-cell">{{ b.totalPrice | number:'1.2-2' }} €</td>
              <td><app-badge [status]="b.status"></app-badge></td>
              <td class="text-right">
                <div class="row-actions">
                  <button
                    class="btn btn-outline btn-sm icon-btn confirm-btn"
                    *ngIf="b.status === 'PENDING' && auth.isAdmin()"
                    (click)="confirm(b)"
                    title="Confirmer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                  <button
                    class="btn btn-outline btn-sm icon-btn delete-btn"
                    *ngIf="b.status !== 'CANCELLED'"
                    (click)="cancel(b)"
                    title="Annuler"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
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

    .table-container {
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--bg-glass-heavy);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .modern-table th {
      padding: 1.25rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid var(--border);
    }

    .modern-table td {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .table-row { transition: background 0.3s ease; }
    .table-row:hover { background: rgba(15, 23, 42, 0.02); }

    .film-name { font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
    .date-cell { display: flex; flex-direction: column; gap: 0.2rem; }
    .date { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
    .time { font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600; }

    .seats-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--bg-main);
      border-radius: 8px;
      font-weight: 700;
      border: 1px solid var(--border);
      color: var(--text-primary);
    }

    .price-cell { font-weight: 800; color: var(--text-primary); }

    .row-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .icon-btn {
      padding: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirm-btn:hover { color: #10b981; border-color: rgba(16, 185, 129, 0.5); background: rgba(16, 185, 129, 0.05); }
    .delete-btn:hover { color: #ef4444; border-color: rgba(239, 68, 68, 0.5); background: rgba(239, 68, 68, 0.05); }

    .text-right { text-align: right; }

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
      .modern-table thead { display: none; }
      .modern-table td { display: block; padding: 1rem 1.5rem; border: none; }
      .modern-table tr { border-bottom: 1px solid var(--border); display: block; padding: 1rem 0; }
      .row-actions { justify-content: flex-start; }
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

