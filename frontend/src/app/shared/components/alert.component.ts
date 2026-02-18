import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert" [ngClass]="'alert-' + type">
      {{ message }}
    </div>
  `,
  styles: [`
    .alert {
      padding: 0.8rem 1rem;
      font-size: 12px;
      margin-bottom: 1rem;
      border-left: 3px solid;
      font-family: var(--font-mono);
    }
    .alert-error   { background: rgba(192,57,43,0.1); border-color: var(--red);  color: #e74c3c; }
    .alert-success { background: rgba(46,204,113,0.1); border-color: var(--green); color: var(--green); }
    .alert-info    { background: rgba(201,168,76,0.1); border-color: var(--gold); color: var(--gold); }
  `]
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: AlertType = 'error';
}
