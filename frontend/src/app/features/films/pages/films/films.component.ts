import { Component, OnInit, inject } from '@angular/core';
import { FilmService } from '../../../../core/services/film.service';
import { CinemaService } from '../../../../core/services/cinema.service';
import { BookingService } from '../../../../core/services/booking.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FilmCardComponent } from '../../components/film-card/film-card.component';
import { FilmFormComponent } from '../../components/film-form/film-form.component';
import { BookingFormComponent } from '../../../../features/bookings/components/booking-form/booking-form.component';
import { Film, CreateFilmRequest } from '../../../../core/models/film.model';
import { Cinema } from '../../../../core/models/cinema.model';

@Component({
  selector: 'app-films-page',
  standalone: true,
  imports: [FilmCardComponent, FilmFormComponent, BookingFormComponent],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsPageComponent implements OnInit {
  auth = inject(AuthService);
  private filmSvc = inject(FilmService);
  private cinemaSvc = inject(CinemaService);
  private bookingSvc = inject(BookingService);

  films: Film[] = [];
  filteredFilms: Film[] = [];
  cinemas: Cinema[] = [];
  genres: string[] = [];

  loading = true;
  searchQuery = '';
  selectedGenre = 'Tous';

  filmFormOpen = false;
  selectedFilm: Film | null = null;
  formLoading = false;
  formError = '';

  bookingOpen = false;
  selectedBookFilmId: number | null = null;
  bookingLoading = false;
  bookingError = '';

  ngOnInit(): void {
    this.loadFilms();
    this.cinemaSvc.getAll().subscribe({ next: c => this.cinemas = c, error: () => { } });
  }

  loadFilms(): void {
    this.loading = true;
    this.filmSvc.getAll().subscribe({
      next: f => {
        this.films = f;
        this.extractGenres(f);
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  extractGenres(films: Film[]): void {
    const set = new Set(films.map(f => f.genre));
    this.genres = Array.from(set).sort();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredFilms = this.films.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(this.searchQuery) ||
        f.genre.toLowerCase().includes(this.searchQuery);
      const matchesGenre = this.selectedGenre === 'Tous' || f.genre === this.selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedGenre = 'Tous';
    this.applyFilters();
  }

  openFilmForm(film?: Film): void {
    this.selectedFilm = film ?? null;
    this.formError = '';
    this.filmFormOpen = true;
  }

  onFilmSave(req: CreateFilmRequest): void {
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

  onDelete(film: Film): void {
    if (!confirm(`Supprimer "${film.title}" ?`)) return;
    this.filmSvc.delete(film.id).subscribe({ next: () => this.loadFilms(), error: () => { } });
  }

  openBooking(film: Film): void {
    this.selectedBookFilmId = film.id;
    this.bookingError = '';
    this.bookingOpen = true;
  }

  onBookingSave(req: any): void {
    this.bookingLoading = true;
    this.bookingError = '';
    this.bookingSvc.create(req).subscribe({
      next: () => { this.bookingLoading = false; this.bookingOpen = false; },
      error: e => { this.bookingLoading = false; this.bookingError = e.error?.message || 'Erreur.'; }
    });
  }
}
