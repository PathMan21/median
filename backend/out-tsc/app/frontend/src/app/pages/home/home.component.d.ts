import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
export declare class HomeComponent implements OnInit {
    auth: AuthService;
    private filmService;
    private cinemaService;
    private bookingService;
    private router;
    films: Film[];
    cinemas: Cinema[];
    loading: boolean;
    userBookingsCount: number | null;
    bookingOpen: boolean;
    bookingLoading: boolean;
    bookingError: string;
    selectedFilmId: number | null;
    ngOnInit(): void;
    private loadUserBookings;
    openBooking(film: Film): void;
    onBookingSave(req: any): void;
}
