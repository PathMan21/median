import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert-v2 glass animate-fade-in" [ngClass]="'alert-' + type">
      <div class="alert-icon">
        <svg *ngIf="type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <svg *ngIf="type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <svg *ngIf="type === 'info'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </div>
      <div class="alert-content">{{ message }}</div>
    </div>
  `,
  styles: [`
    .alert-v2 {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid var(--border);
    }

    .alert-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.08); /* Soft red */
      border-color: rgba(239, 68, 68, 0.2);
      color: #dc2626; /* Deep red */
    }

    .alert-success {
      background: rgba(22, 163, 74, 0.08); /* Soft green */
      border-color: rgba(22, 163, 74, 0.2);
      color: #16a34a; /* Deep green */
    }

    .alert-info {
      background: rgba(14, 165, 233, 0.08); /* Soft blue */
      border-color: rgba(14, 165, 233, 0.2);
      color: #0284c7; /* Deep blue */
    }
  `]
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: AlertType = 'error';
}

