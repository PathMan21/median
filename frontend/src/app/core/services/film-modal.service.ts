import { Injectable, signal } from '@angular/core';
import { Film } from '../models/film.model';

@Injectable({ providedIn: 'root' })
export class FilmModalService {
    private isOpenSignal = signal(false);
    private selectedFilmSignal = signal<Film | null>(null);

    isOpen = this.isOpenSignal.asReadonly();
    selectedFilm = this.selectedFilmSignal.asReadonly();

    open(film: Film): void {
        this.selectedFilmSignal.set(film);
        this.isOpenSignal.set(true);
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.isOpenSignal.set(false);
        this.selectedFilmSignal.set(null);
        document.body.style.overflow = '';
    }
}
