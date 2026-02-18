"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const rxjs_1 = require("rxjs");
const film_service_1 = require("../../core/services/film.service");
const cinema_service_1 = require("../../core/services/cinema.service");
const booking_service_1 = require("../../core/services/booking.service");
const auth_service_1 = require("../../core/services/auth.service");
const film_card_component_1 = require("../../features/films/film-card.component");
const booking_form_component_1 = require("../../features/bookings/booking-form.component");
let HomeComponent = class HomeComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
    filmService = (0, core_1.inject)(film_service_1.FilmService);
    cinemaService = (0, core_1.inject)(cinema_service_1.CinemaService);
    bookingService = (0, core_1.inject)(booking_service_1.BookingService);
    router = (0, core_1.inject)(router_1.Router);
    films = [];
    cinemas = [];
    loading = true;
    userBookingsCount = null;
    bookingOpen = false;
    bookingLoading = false;
    bookingError = '';
    selectedFilmId = null;
    ngOnInit() {
        (0, rxjs_1.forkJoin)({
            films: this.filmService.getAll(),
            cinemas: this.cinemaService.getAll(),
        }).subscribe({
            next: ({ films, cinemas }) => {
                this.films = films;
                this.cinemas = cinemas;
                this.loading = false;
                if (this.auth.isLoggedIn())
                    this.loadUserBookings();
            },
            error: () => { this.loading = false; }
        });
    }
    loadUserBookings() {
        const user = this.auth.currentUser();
        if (!user)
            return;
        this.bookingService.getByUser(user.id).subscribe({
            next: b => { this.userBookingsCount = b.length; },
            error: () => { }
        });
    }
    openBooking(film) {
        this.selectedFilmId = film.id;
        this.bookingError = '';
        this.bookingOpen = true;
    }
    onBookingSave(req) {
        this.bookingLoading = true;
        this.bookingError = '';
        this.bookingService.create(req).subscribe({
            next: () => {
                this.bookingLoading = false;
                this.bookingOpen = false;
                this.loadUserBookings();
            },
            error: (e) => {
                this.bookingLoading = false;
                this.bookingError = e.error?.message || 'Erreur lors de la réservation.';
            }
        });
    }
};
exports.HomeComponent = HomeComponent;
exports.HomeComponent = HomeComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-home',
        standalone: true,
        imports: [common_1.CommonModule, film_card_component_1.FilmCardComponent, booking_form_component_1.BookingFormComponent, router_1.RouterLink],
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
], HomeComponent);
//# sourceMappingURL=home.component.js.map