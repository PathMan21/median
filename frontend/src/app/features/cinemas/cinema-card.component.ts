import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cinema } from '../../core/models/cinema.model';

@Component({
  selector: 'app-cinema-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-genre">{{ cinema.city }}</div>
      <div class="card-title">{{ cinema.name }}</div>
      <div class="card-desc">{{ cinema.address }}</div>
      <div class="card-meta">
        <div class="meta-item"><strong>Capacité</strong>{{ cinema.capacity }} places</div>
        <div class="meta-item"><strong>Tél.</strong>{{ cinema.phone }}</div>
      </div>
      <div class="card-actions" *ngIf="showAdmin">
        <button class="btn btn-icon btn-sm" (click)="edit.emit(cinema)" title="Modifier">✎</button>
        <button class="btn btn-red btn-sm"  (click)="delete.emit(cinema)" title="Supprimer">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--surface); padding: 1.5rem;
      transition: background 0.2s; position: relative; overflow: hidden;
    }
    .card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: var(--gold); transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .card:hover { background: var(--surface2); }
    .card:hover::after { transform: scaleX(1); }
    .card-genre  { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .card-title  { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text); margin-bottom: 0.6rem; }
    .card-desc   { color: var(--text-mid); font-size: 12px; margin-bottom: 1rem; }
    .card-meta   { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .meta-item   { font-size: 10px; color: var(--text-dim); }
    .meta-item strong { color: var(--text-mid); display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
    .card-actions { display: flex; gap: 0.5rem; }
  `]
})
export class CinemaCardComponent {
  @Input() cinema!: Cinema;
  @Input() showAdmin = false;
  @Output() edit   = new EventEmitter<Cinema>();
  @Output() delete = new EventEmitter<Cinema>();
}
