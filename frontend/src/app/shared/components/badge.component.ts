import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatus } from '../../core/models/booking.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="'badge-' + status.toLowerCase()">
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 8px;
      border: 1px solid;
      font-family: var(--font-mono);
    }
    .badge-pending   { border-color: var(--gold-dim); color: var(--gold); }
    .badge-confirmed { border-color: #27ae60; color: var(--green); }
    .badge-cancelled { border-color: #922b21; color: var(--red); }
    .badge-completed { border-color: #555; color: var(--text-dim); }
  `]
})
export class BadgeComponent {
  @Input() status: BookingStatus = 'PENDING';

  get label(): string {
    const map: Record<BookingStatus, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmé',
      CANCELLED: 'Annulé',
      COMPLETED: 'Terminé'
    };
    return map[this.status];
  }
}
