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
    <div class="films-page container animate-fade-in">
      <header class="page-header">
        <div class="header-main">
          <h1 class="font-display text-gradient">Catalogue Ciné</h1>
          <p class="muted">Découvrez notre sélection exclusive de chefs-d'œuvre.</p>
        </div>
        
        <div class="header-actions" *ngIf="auth.isAdmin()">
          <button class="btn btn-primary" (click)="openFilmForm()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Ajouter un Film
          </button>
        </div>
      </header>

      <!-- Advanced Filter Bar -->
      <div class="filter-bar glass">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Rechercher un film..." (input)="onSearch($event)" class="search-input" />
        </div>
        
        <div class="filter-pills">
          <span 
            class="filter-pill" 
            [class.active]="selectedGenre === 'Tous'"
            (click)="onGenreSelect('Tous')"
          >Tous</span>
          <span 
            *ngFor="let g of genres" 
            class="filter-pill"
            [class.active]="selectedGenre === g"
            (click)="onGenreSelect(g)"
          >{{ g }}</span>
        </div>
      </div>

      <!-- Modern Loader -->
      <div *ngIf="loading" class="modern-loader">
        <div class="loader-pulse shadow-neon"></div>
        <p>Projection en cours...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredFilms.length === 0" class="empty-state glass">
        <div class="empty-icon shadow-neon">🎬</div>
        <h3>Silence sur le plateau</h3>
        <p class="muted">Aucun film ne correspond à votre recherche.</p>
        <button class="btn btn-outline btn-sm" (click)="clearFilters()">Réinitialiser</button>
      </div>

      <!-- Cinema Grid -->
      <div class="films-grid" *ngIf="!loading && filteredFilms.length > 0">
        <app-film-card
          *ngFor="let f of filteredFilms"
          [film]="f"
          [showActions]="auth.isLoggedIn()"
          [showAdmin]="auth.isAdmin()"
          (book)="openBooking($event)"
          (edit)="openFilmForm($event)"
          (delete)="onDelete($event)"
        ></app-film-card>
      </div>

      <!-- Modals -->
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
    </div>
  `,
  styles: [`
    .films-page {
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

    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      gap: 2rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-surface);
      padding: 0.5rem 1.25rem;
      border-radius: 100px;
      flex: 1;
      max-width: 400px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .search-icon { color: var(--text-muted); }

    .search-input {
      background: none;
      border: none;
      color: var(--text-primary);
      outline: none;
      width: 100%;
      font-family: inherit;
    }

    .filter-pills {
      display: flex;
      gap: 0.75rem;
    }

    .filter-pill {
      padding: 0.5rem 1.25rem;
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .filter-pill:hover, .filter-pill.active {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2); /* Red glow */
    }

    .films-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 3rem;
    }

    .empty-state {
      padding: 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface);
      border-radius: 50%;
      margin-bottom: 1rem;
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
      .filter-bar { flex-direction: column; align-items: stretch; }
      .search-box { max-width: none; }
      .filter-pills { overflow-x: auto; padding-bottom: 0.5rem; }
    }
  `]
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

