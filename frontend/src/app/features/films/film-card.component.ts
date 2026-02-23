import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from '../../core/models/film.model';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="film-card-v2 animate-fade-in">
      <div class="poster-container">
        <!-- Abstract Cinema Placeholder -->
        <div class="poster-placeholder" [style.background]="getGradient(film.genre)">
           <div class="genre-tag">{{ film.genre }}</div>
        </div>
        
        <div class="poster-overlay glass">
          <div class="overlay-content">
            <p class="film-desc">{{ film.description | slice:0:120 }}...</p>
            <div class="meta-row">
              <span class="meta-pill">{{ film.duration }} min</span>
              <span class="meta-pill">{{ film.releaseDate | date:'yyyy' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-info">
        <h3 class="film-title">{{ film.title }}</h3>
        
        <div class="card-actions" *ngIf="showActions || showAdmin">
          <button class="btn btn-primary btn-sm flex-grow" *ngIf="showActions" (click)="book.emit(film)">
            Réserver
          </button>
          
          <div class="admin-actions" *ngIf="showAdmin">
            <button class="btn btn-outline btn-sm icon-btn" (click)="edit.emit(film)" title="Modifier">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn btn-outline btn-sm icon-btn delete-btn" (click)="delete.emit(film)" title="Supprimer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .film-card-v2 {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .poster-container {
      position: relative;
      aspect-ratio: 2/3;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      cursor: pointer;
    }

    .poster-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.6s ease;
    }

    .genre-tag {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--bg-glass-heavy);
      backdrop-filter: blur(8px);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-weight: 700;
      z-index: 5;
    }

    .poster-overlay {
      position: absolute;
      inset: 0;
      opacity: 0;
      display: flex;
      align-items: flex-end;
      padding: 1.5rem;
      transition: all 0.4s ease;
      background: linear-gradient(to top, var(--bg-surface), transparent);
    }

    .film-card-v2:hover .poster-overlay {
      opacity: 1;
    }

    .film-card-v2:hover .poster-placeholder {
      transform: scale(1.1);
    }

    .overlay-content {
      transform: translateY(20px);
      transition: transform 0.4s ease;
    }

    .film-card-v2:hover .overlay-content {
      transform: translateY(0);
    }

    .film-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
      font-weight: 500;
    }

    .meta-row {
      display: flex;
      gap: 0.5rem;
    }

    .meta-pill {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .film-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .flex-grow { flex: 1; }

    .admin-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-btn {
      padding: 0.5rem;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.5);
    }
  `]
})
export class FilmCardComponent {
  @Input() film!: Film;
  @Input() showActions = false;
  @Input() showAdmin = false;
  @Output() book = new EventEmitter<Film>();
  @Output() edit = new EventEmitter<Film>();
  @Output() delete = new EventEmitter<Film>();

  getGradient(genre: string): string {
    const hash = genre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Pure Red, Deep Red, Ruby, Jasper, Crimson (Removing pink/magenta)
    const hues = [0, 5, 10, 355, 350];
    const hue = hues[hash % hues.length];
    return `linear-gradient(135deg, hsl(${hue}, 85%, 40%), hsl(${hue + 5}, 75%, 25%))`;
  }
}
