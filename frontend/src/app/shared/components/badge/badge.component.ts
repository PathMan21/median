import { Component, Input } from '@angular/core';
import { BookingStatus } from '../../../core/models/booking.model';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [],
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
    @Input() status: BookingStatus = 'PENDING';

    get label(): string {
        const map: Record<BookingStatus, string> = {
            PENDING: 'En attente',
            CONFIRMED: 'Confirmé',
            CANCELLED: 'Annulé',
            COMPLETED: 'Terminé'
        };
        return map[this.status];
    }
}
