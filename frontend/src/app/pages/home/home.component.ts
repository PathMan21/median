import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FilmService } from '../../core/services/film.service';
import { CinemaService } from '../../core/services/cinema.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { FilmCardComponent } from '../../features/films/film-card.component';
import { BookingFormComponent } from '../../features/bookings/booking-form.component';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FilmCardComponent, BookingFormComponent, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-eyebrow">Bienvenue sur la plateforme</div>
      <h1 class="hero-title">Réservez vos<br/><em>séances</em> en ligne</h1>
      <p class="hero-desc">
        Découvrez les films à l'affiche, choisissez votre cinéma
        et réservez vos places en quelques clics.
      </p>
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-val">{{ films.length || '—' }}</div>
          <div class="stat-label">Films</div>
        </div>
        <div class="stat">
          <div class="stat-val">{{ cinemas.length || '—' }}</div>
          <div class="stat-label">Cinémas</div>
        </div>
        <div class="stat" *ngIf="auth.isLoggedIn()">
          <div class="stat-val">{{ userBookingsCount ?? '—' }}</div>
          <div class="stat-label">Réservations</div>
        </div>
      </div>
    </section>

    <div class="top-bar">
      <div>
        <div class="section-title">À l'affiche</div>
        <div class="section-sub">Films disponibles</div>
      </div>
      <button class="btn btn-outline btn-sm" [routerLink]="['/films']">Voir tout →</button>
    </div>

    <div *ngIf="loading" class="loading">Chargement</div>

    <div class="grid" *ngIf="!loading">
      <app-film-card
        *ngFor="let f of films.slice(0, 4)"
        [film]="f"
        [showActions]="auth.isLoggedIn()"
        (book)="openBooking($event)"
      ></app-film-card>
    </div>

    <app-booking-form
      [isOpen]="bookingOpen"
      [films]="films"
      [cinemas]="cinemas"
      [preselectedFilmId]="selectedFilmId"
      [userId]="auth.currentUser()!.id"
      [loading]="bookingLoading"
      [error]="bookingError"
      (save)="onBookingSave($event)"
      (cancel)="bookingOpen = false"
      *ngIf="auth.isLoggedIn()"
    ></app-booking-form>
  `,
  styles: [`
    :host { display: block; }
    .hero { padding: 4rem 0 3rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
    .hero-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 900; line-height: 1.0; margin-bottom: 1.2rem;
    }
    .hero-title em { font-style: italic; color: var(--gold); }
    .hero-desc { color: var(--text-mid); font-size: 13px; line-height: 1.7; max-width: 480px; margin-bottom: 2rem; }
    .hero-stats { display: flex; gap: 2.5rem; }
    .stat-val   { font-family: var(--font-display); font-size: 2rem; font-weight: 700; line-height: 1; }
    .stat-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); margin-top: 4px; }
    .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  `]
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  private filmService    = inject(FilmService);
  private cinemaService  = inject(CinemaService);
  private bookingService = inject(BookingService);
  private router         = inject(Router);

  films: Film[] = [];
  cinemas: Cinema[] = [];
  loading = true;
  userBookingsCount: number | null = null;

  bookingOpen    = false;
  bookingLoading = false;
  bookingError   = '';
  selectedFilmId: number | null = null;

  ngOnInit(): void {
    forkJoin({
      films:   this.filmService.getAll(),
      cinemas: this.cinemaService.getAll(),
    }).subscribe({
      next: ({ films, cinemas }) => {
        this.films   = films;
        this.cinemas = cinemas;
        this.loading = false;
        if (this.auth.isLoggedIn()) this.loadUserBookings();
      },
      error: () => { this.loading = false; }
    });
  }

  private loadUserBookings(): void {
    const user = this.auth.currentUser();
    if (!user) return;
    this.bookingService.getByUser(user.id).subscribe({
      next: b => { this.userBookingsCount = b.length; },
      error: () => {}
    });
  }

  openBooking(film: Film): void {
    this.selectedFilmId = film.id;
    this.bookingError   = '';
    this.bookingOpen    = true;
  }

  onBookingSave(req: any): void {
    this.bookingLoading = true;
    this.bookingError   = '';
    this.bookingService.create(req).subscribe({
      next: () => {
        this.bookingLoading = false;
        this.bookingOpen    = false;
        this.loadUserBookings();
      },
      error: (e) => {
        this.bookingLoading = false;
        this.bookingError   = e.error?.message || 'Erreur lors de la réservation.';
      }
    });
  }
}
