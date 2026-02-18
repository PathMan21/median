"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsPageComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const rxjs_1 = require("rxjs");
const booking_service_1 = require("../../core/services/booking.service");
const film_service_1 = require("../../core/services/film.service");
const cinema_service_1 = require("../../core/services/cinema.service");
const auth_service_1 = require("../../core/services/auth.service");
const booking_form_component_1 = require("../../features/bookings/booking-form.component");
const badge_component_1 = require("../../shared/components/badge.component");
let BookingsPageComponent = class BookingsPageComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
    bookingSvc = (0, core_1.inject)(booking_service_1.BookingService);
    filmSvc = (0, core_1.inject)(film_service_1.FilmService);
    cinemaSvc = (0, core_1.inject)(cinema_service_1.CinemaService);
    bookings = [];
    films = [];
    cinemas = [];
    loading = true;
    formOpen = false;
    formLoading = false;
    formError = '';
    ngOnInit() {
        (0, rxjs_1.forkJoin)({
            films: this.filmSvc.getAll(),
            cinemas: this.cinemaSvc.getAll(),
        }).subscribe({ next: ({ films, cinemas }) => { this.films = films; this.cinemas = cinemas; } });
        this.load();
    }
    load() {
        this.loading = true;
        const obs = this.auth.isAdmin()
            ? this.bookingSvc.getAll()
            : this.bookingSvc.getByUser(this.auth.currentUser().id);
        obs.subscribe({
            next: b => { this.bookings = b; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    openForm() { this.formError = ''; this.formOpen = true; }
    onSave(req) {
        this.formLoading = true;
        this.formError = '';
        this.bookingSvc.create(req).subscribe({
            next: () => { this.formLoading = false; this.formOpen = false; this.load(); },
            error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
        });
    }
    confirm(b) {
        this.bookingSvc.confirm(b.id).subscribe({ next: () => this.load(), error: () => { } });
    }
    cancel(b) {
        if (!confirm('Annuler cette réservation ?'))
            return;
        this.bookingSvc.cancel(b.id).subscribe({ next: () => this.load(), error: () => { } });
    }
};
exports.BookingsPageComponent = BookingsPageComponent;
exports.BookingsPageComponent = BookingsPageComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-bookings-page',
        standalone: true,
        imports: [common_1.CommonModule, booking_form_component_1.BookingFormComponent, badge_component_1.BadgeComponent],
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
], BookingsPageComponent);
//# sourceMappingURL=bookings.component.js.map