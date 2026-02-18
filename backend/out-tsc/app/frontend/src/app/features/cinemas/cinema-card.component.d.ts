import { EventEmitter } from '@angular/core';
import { Cinema } from '../../core/models/cinema.model';
export declare class CinemaCardComponent {
    cinema: Cinema;
    showAdmin: boolean;
    edit: EventEmitter<Cinema>;
    delete: EventEmitter<Cinema>;
}
