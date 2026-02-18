import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Film, CreateFilmRequest } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
export declare class FilmsPageComponent implements OnInit {
    auth: AuthService;
    private filmSvc;
    private cinemaSvc;
    private bookingSvc;
    films: Film[];
    cinemas: Cinema[];
    loading: boolean;
    filmFormOpen: boolean;
    selectedFilm: Film | null;
    formLoading: boolean;
    formError: string;
    bookingOpen: boolean;
    selectedBookFilmId: number | null;
    bookingLoading: boolean;
    bookingError: string;
    ngOnInit(): void;
    loadFilms(): void;
    openFilmForm(film?: Film): void;
    onFilmSave(req: CreateFilmRequest): void;
    onDelete(film: Film): void;
    openBooking(film: Film): void;
    onBookingSave(req: any): void;
}
