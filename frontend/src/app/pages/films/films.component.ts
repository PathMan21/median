import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmService } from '../../core/services/film.service';
import { CinemaService } from '../../core/services/cinema.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { FilmCardComponent } from '../../features/films/film-card.component';
import { FilmFormComponent } from '../../features/films/film-form.component';
import { BookingFormComponent } from '../../features/bookings/booking-form.component';
import { Film, CreateFilmRequest } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';

@Component({
  selector: 'app-films-page',
  standalone: true,
  imports: [CommonModule, FilmCardComponent, FilmFormComponent, BookingFormComponent],
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
export class FilmsPageComponent implements OnInit {
  auth            = inject(AuthService);
  private filmSvc    = inject(FilmService);
  private cinemaSvc  = inject(CinemaService);
  private bookingSvc = inject(BookingService);

  films: Film[] = [];
  cinemas: Cinema[] = [];
  loading = true;

  filmFormOpen  = false;
  selectedFilm: Film | null = null;
  formLoading   = false;
  formError     = '';

  bookingOpen          = false;
  selectedBookFilmId: number | null = null;
  bookingLoading       = false;
  bookingError         = '';

  ngOnInit(): void {
    this.loadFilms();
    this.cinemaSvc.getAll().subscribe({ next: c => this.cinemas = c, error: () => {} });
  }

  loadFilms(): void {
    this.loading = true;
    this.filmSvc.getAll().subscribe({
      next: f => { this.films = f; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openFilmForm(film?: Film): void {
    this.selectedFilm = film ?? null;
    this.formError    = '';
    this.filmFormOpen = true;
  }

  onFilmSave(req: CreateFilmRequest): void {
    this.formLoading = true;
    this.formError   = '';
    const obs = this.selectedFilm
      ? this.filmSvc.update(this.selectedFilm.id, req)
      : this.filmSvc.create(req);

    obs.subscribe({
      next: () => { this.formLoading = false; this.filmFormOpen = false; this.loadFilms(); },
      error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
    });
  }

  onDelete(film: Film): void {
    if (!confirm(`Supprimer "${film.title}" ?`)) return;
    this.filmSvc.delete(film.id).subscribe({ next: () => this.loadFilms(), error: () => {} });
  }

  openBooking(film: Film): void {
    this.selectedBookFilmId = film.id;
    this.bookingError       = '';
    this.bookingOpen        = true;
  }

  onBookingSave(req: any): void {
    this.bookingLoading = true;
    this.bookingError   = '';
    this.bookingSvc.create(req).subscribe({
      next: () => { this.bookingLoading = false; this.bookingOpen = false; },
      error: e => { this.bookingLoading = false; this.bookingError = e.error?.message || 'Erreur.'; }
    });
  }
}
