import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Film } from '../../../../core/models/film.model';

@Component({
    selector: 'app-film-card',
    standalone: true,
    imports: [CommonModule, DatePipe, SlicePipe],
    templateUrl: './film-card.component.html',
    styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent {
    @Input() film!: Film;
    @Input() showActions = false;
    @Input() showAdmin = false;
    @Output() book = new EventEmitter<Film>();
    @Output() edit = new EventEmitter<Film>();
    @Output() delete = new EventEmitter<Film>();

    getGradient(genre: string): string {
        const hash = genre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hues = [0, 5, 10, 355, 350];
        const hue = hues[hash % hues.length];
        return `linear-gradient(135deg, hsl(${hue}, 85%, 40%), hsl(${hue + 5}, 75%, 25%))`;
    }
}
