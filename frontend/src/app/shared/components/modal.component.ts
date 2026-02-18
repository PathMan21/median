import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" [class.open]="isOpen" (click)="onOverlayClick($event)">
      <div class="modal">
        <button class="modal-close" (click)="close.emit()">✕</button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(4px);
      z-index: 200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
    .modal {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 2rem;
      width: 100%;
      max-width: 480px;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none;
      color: var(--text-dim); font-size: 18px;
      cursor: pointer; line-height: 1;
    }
    .modal-close:hover { color: var(--text); }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
