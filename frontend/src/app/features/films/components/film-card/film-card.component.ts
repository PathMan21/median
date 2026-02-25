import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Film } from '../../../../core/models/film.model';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

import { FilmModalService } from '../../../../core/services/film-modal.service';

@Component({
    selector: 'app-film-card',
    standalone: true,
    imports: [CommonModule, RouterLink, DurationPipe],
    templateUrl: './film-card.component.html',
    styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent {
    modalSvc = inject(FilmModalService);
    @Input() film!: Film;
    @Input() showActions = false;
    @Input() showDetailsOnly = false;
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
