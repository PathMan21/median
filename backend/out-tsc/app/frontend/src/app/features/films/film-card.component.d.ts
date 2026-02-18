import { EventEmitter } from '@angular/core';
import { Film } from '../../core/models/film.model';
export declare class FilmCardComponent {
    film: Film;
    showActions: boolean;
    showAdmin: boolean;
    book: EventEmitter<Film>;
    edit: EventEmitter<Film>;
    delete: EventEmitter<Film>;
}
