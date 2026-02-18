import { EventEmitter } from '@angular/core';
export declare class ModalComponent {
    isOpen: boolean;
    close: EventEmitter<void>;
    onOverlayClick(e: MouseEvent): void;
}
