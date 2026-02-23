import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatus } from '../../core/models/booking.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge-v2" [ngClass]="'badge-' + status.toLowerCase()">
      <span class="badge-dot"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .badge-v2 {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .badge-pending {
      color: #b45309; /* Deep amber */
      background: #fffbeb;
      border-color: #fde68a;
    }

    .badge-confirmed {
      color: #15803d; /* Deep green */
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .badge-cancelled {
      color: #b91c1c; /* Deep red */
      background: #fef2f2;
      border-color: #fecaca;
    }

    .badge-completed {
      color: var(--text-secondary);
      background: var(--bg-main);
      border-color: var(--border);
    }
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

