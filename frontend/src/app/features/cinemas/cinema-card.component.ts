import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cinema } from '../../core/models/cinema.model';

@Component({
  selector: 'app-cinema-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cinema-card-v2 glass animate-fade-in">
      <div class="card-glow"></div>
      
      <div class="card-header">
        <div class="location-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {{ cinema.city }}
        </div>
      </div>

      <div class="card-content">
        <h3 class="cinema-name">{{ cinema.name }}</h3>
        <p class="cinema-address muted">{{ cinema.address }}</p>
        
        <div class="cinema-stats">
          <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span class="stat-text">{{ cinema.capacity }} places</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📞</span>
            <span class="stat-text">{{ cinema.phone }}</span>
          </div>
        </div>
      </div>

      <div class="card-footer" *ngIf="showAdmin">
        <div class="admin-actions">
          <button class="btn btn-outline btn-sm icon-btn" (click)="edit.emit(cinema)" title="Modifier">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-outline btn-sm icon-btn delete-btn" (click)="delete.emit(cinema)" title="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cinema-card-v2 {
      position: relative;
      padding: 2rem;
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      background: var(--bg-surface);
      border: 1px solid var(--border);
    }

    .cinema-card-v2:hover {
      transform: translateY(-5px);
      border-color: var(--accent-secondary);
      box-shadow: var(--shadow-soft);
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(14, 165, 233, 0.05), transparent 70%);
      pointer-events: none;
    }

    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.8rem;
      background: rgba(14, 165, 233, 0.08);
      color: var(--accent-secondary);
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .cinema-name {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .cinema-address {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .cinema-stats {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .stat-icon { font-size: 1rem; }

    .card-footer {
      margin-top: auto;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }

    .admin-actions {
      display: flex;
      gap: 0.75rem;
    }

    .icon-btn {
      padding: 0.6rem;
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
export class CinemaCardComponent {
  @Input() cinema!: Cinema;
  @Input() showAdmin = false;
  @Output() edit = new EventEmitter<Cinema>();
  @Output() delete = new EventEmitter<Cinema>();
}

