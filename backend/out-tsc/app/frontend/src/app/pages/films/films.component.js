"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmsPageComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const film_service_1 = require("../../core/services/film.service");
const cinema_service_1 = require("../../core/services/cinema.service");
const booking_service_1 = require("../../core/services/booking.service");
const auth_service_1 = require("../../core/services/auth.service");
const film_card_component_1 = require("../../features/films/film-card.component");
const film_form_component_1 = require("../../features/films/film-form.component");
const booking_form_component_1 = require("../../features/bookings/booking-form.component");
let FilmsPageComponent = class FilmsPageComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
    filmSvc = (0, core_1.inject)(film_service_1.FilmService);
    cinemaSvc = (0, core_1.inject)(cinema_service_1.CinemaService);
    bookingSvc = (0, core_1.inject)(booking_service_1.BookingService);
    films = [];
    cinemas = [];
    loading = true;
    filmFormOpen = false;
    selectedFilm = null;
    formLoading = false;
    formError = '';
    bookingOpen = false;
    selectedBookFilmId = null;
    bookingLoading = false;
    bookingError = '';
    ngOnInit() {
        this.loadFilms();
        this.cinemaSvc.getAll().subscribe({ next: c => this.cinemas = c, error: () => { } });
    }
    loadFilms() {
        this.loading = true;
        this.filmSvc.getAll().subscribe({
            next: f => { this.films = f; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    openFilmForm(film) {
        this.selectedFilm = film ?? null;
        this.formError = '';
        this.filmFormOpen = true;
    }
    onFilmSave(req) {
        this.formLoading = true;
        this.formError = '';
        const obs = this.selectedFilm
            ? this.filmSvc.update(this.selectedFilm.id, req)
            : this.filmSvc.create(req);
        obs.subscribe({
            next: () => { this.formLoading = false; this.filmFormOpen = false; this.loadFilms(); },
            error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
        });
    }
    onDelete(film) {
        if (!confirm(`Supprimer "${film.title}" ?`))
            return;
        this.filmSvc.delete(film.id).subscribe({ next: () => this.loadFilms(), error: () => { } });
    }
    openBooking(film) {
        this.selectedBookFilmId = film.id;
        this.bookingError = '';
        this.bookingOpen = true;
    }
    onBookingSave(req) {
        this.bookingLoading = true;
        this.bookingError = '';
        this.bookingSvc.create(req).subscribe({
            next: () => { this.bookingLoading = false; this.bookingOpen = false; },
            error: e => { this.bookingLoading = false; this.bookingError = e.error?.message || 'Erreur.'; }
        });
    }
};
exports.FilmsPageComponent = FilmsPageComponent;
exports.FilmsPageComponent = FilmsPageComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-films-page',
        standalone: true,
        imports: [common_1.CommonModule, film_card_component_1.FilmCardComponent, film_form_component_1.FilmFormComponent, booking_form_component_1.BookingFormComponent],
        template: `
    <div class="top-bar">
      <div>
        <div class="section-title">Films</div>
        <div class="section-sub">Catalogue complet</div>
      </div>
      <button class="btn btn-gold btn-sm" *ngIf="auth.isAdmin()" (click)="openFilmForm()">+ Ajouter</button>
    </div>

    <div *ngIf="loading" class="loading">Chargement</div>
    <div *ngIf="!loading && films.length === 0" class="empty">
      <div class="empty-icon">🎬</div>
      Aucun film disponible
    </div>

    <div class="grid" *ngIf="!loading && films.length > 0">
      <app-film-card
        *ngFor="let f of films"
        [film]="f"
        [showActions]="auth.isLoggedIn()"
        [showAdmin]="auth.isAdmin()"
        (book)="openBooking($event)"
        (edit)="openFilmForm($event)"
        (delete)="onDelete($event)"
      ></app-film-card>
    </div>

    <app-film-form
      [isOpen]="filmFormOpen"
      [film]="selectedFilm"
      [loading]="formLoading"
      [error]="formError"
      (save)="onFilmSave($event)"
      (cancel)="filmFormOpen = false"
    ></app-film-form>

    <app-booking-form
      [isOpen]="bookingOpen"
      [films]="films"
      [cinemas]="cinemas"
      [preselectedFilmId]="selectedBookFilmId"
      [userId]="auth.currentUser()!.id"
      [loading]="bookingLoading"
      [error]="bookingError"
      (save)="onBookingSave($event)"
      (cancel)="bookingOpen = false"
      *ngIf="auth.isLoggedIn()"
    ></app-booking-form>
  `,
        styles: [`.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }`]
    })
], FilmsPageComponent);
//# sourceMappingURL=films.component.js.map