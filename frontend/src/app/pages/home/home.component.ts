import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilmService } from '../../core/services/film.service';
import { Film } from '../../core/models/film.model';
import { FilmCardComponent } from '../../features/films/film-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FilmCardComponent, RouterLink],
  template: `
    <div class="home-page animate-fade-in">
      <!-- Mega Hero: Featured Film -->
      <section class="mega-hero" *ngIf="featuredFilm" 
        [style.backgroundImage]="'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 1)), url(' + (featuredFilm.id === 1 ? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop') + ')'">
        <div class="hero-content container">
          <div class="featured-badge">À NE PAS MANQUER</div>
          <h1 class="hero-title font-display text-glow">{{ featuredFilm.title }}</h1>
          <p class="hero-desc">{{ featuredFilm.description | slice:0:180 }}...</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" [routerLink]="['/films']">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Réserver ma place
            </button>
            <button class="btn btn-glass btn-lg" [routerLink]="['/films']">Plus d'infos</button>
          </div>
        </div>
      </section>

      <div class="container section-gap">
        <!-- Á l'affiche Section -->
        <section class="films-section">
          <div class="section-header">
            <h2 class="font-display section-title">À l'affiche</h2>
            <a routerLink="/films" class="view-all">Tout le catalogue &rarr;</a>
          </div>
          
          <div class="films-carousel">
            <app-film-card
              *ngFor="let film of films.slice(0, 4)"
              [film]="film"
              [showActions]="true"
              class="carousel-item"
            ></app-film-card>
          </div>
        </section>

        <!-- Stats Section -->
        <section class="quick-stats glass">
          <div class="stat-item" *ngFor="let stat of stats">
            <span class="stat-val font-display">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .home-page { padding-bottom: 5rem; width: 100vw; margin-left: calc(-50vw + 50%); }

    .mega-hero {
      height: 85vh;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      position: relative;
      color: white;
      margin-top: -8rem;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 800px;
    }

    .featured-badge {
      display: inline-block;
      background: var(--accent-primary);
      padding: 0.4rem 1rem;
      border-radius: 4px;
      font-weight: 800;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(185, 28, 28, 0.4);
    }

    .hero-title {
      font-size: clamp(3.5rem, 8vw, 6rem);
      line-height: 1;
      margin-bottom: 1.5rem;
    }

    .text-glow {
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
    }

    .hero-desc {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2.5rem;
      line-height: 1.6;
      max-width: 600px;
    }

    .hero-actions { display: flex; gap: 1.5rem; }

    .section-gap { margin-top: 5rem; display: flex; flex-direction: column; gap: 6rem; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 2.5rem;
      color: var(--text-primary);
      position: relative;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 4px;
      background: var(--accent-primary);
      border-radius: 2px;
    }

    .view-all {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 700;
      transition: opacity 0.3s;
    }

    .view-all:hover { opacity: 0.8; }

    .films-carousel {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2.5rem;
    }

    .btn-lg { padding: 1.25rem 2.5rem; font-size: 1rem; }
    
    .btn-glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-glass:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .quick-stats {
      display: flex;
      justify-content: space-around;
      padding: 3rem;
      border-radius: var(--radius-xl);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-val { font-size: 2rem; color: var(--text-primary); font-weight: 800; }
    .stat-label { color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; font-weight: 700; }

    @media (max-width: 768px) {
      .mega-hero { height: 75vh; }
      .hero-title { font-size: 3rem; }
      .hero-desc { font-size: 1rem; }
      .hero-actions { flex-direction: column; width: 100%; }
      .hero-actions button { width: 100%; }
      .section-title { font-size: 2rem; }
      .quick-stats { flex-direction: column; gap: 2rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private filmSvc = inject(FilmService);
  films: Film[] = [];
  featuredFilm: Film | null = null;
  loading = true;

  stats = [
    { label: "Films à l'affiche", value: '24' },
    { label: 'Salles partenaires', value: '12' },
    { label: 'Clients satisfaits', value: '15k+' }
  ];

  ngOnInit(): void {
    this.filmSvc.getAll().subscribe({
      next: f => {
        this.films = f;
        this.featuredFilm = f[0] || null;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
