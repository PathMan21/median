import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Booking } from '../../core/models/booking.model';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
export declare class BookingsPageComponent implements OnInit {
    auth: AuthService;
    private bookingSvc;
    private filmSvc;
    private cinemaSvc;
    bookings: Booking[];
    films: Film[];
    cinemas: Cinema[];
    loading: boolean;
    formOpen: boolean;
    formLoading: boolean;
    formError: string;
    ngOnInit(): void;
    load(): void;
    openForm(): void;
    onSave(req: any): void;
    confirm(b: Booking): void;
    cancel(b: Booking): void;
}
