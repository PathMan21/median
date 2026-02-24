import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
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
