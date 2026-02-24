import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cinema } from '../../../../core/models/cinema.model';

@Component({
    selector: 'app-cinema-card',
    standalone: true,
    imports: [],
    templateUrl: './cinema-card.component.html',
    styleUrls: ['./cinema-card.component.scss']
})
export class CinemaCardComponent {
    @Input() cinema!: Cinema;
    @Input() showAdmin = false;
    @Output() edit = new EventEmitter<Cinema>();
    @Output() delete = new EventEmitter<Cinema>();
}
