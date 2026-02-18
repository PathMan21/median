import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Cinema, CreateCinemaRequest } from '../../core/models/cinema.model';
export declare class CinemasPageComponent implements OnInit {
    auth: AuthService;
    private svc;
    cinemas: Cinema[];
    loading: boolean;
    formOpen: boolean;
    selectedCinema: Cinema | null;
    formLoading: boolean;
    formError: string;
    ngOnInit(): void;
    load(): void;
    openForm(cinema?: Cinema): void;
    onSave(req: CreateCinemaRequest): void;
    onDelete(cinema: Cinema): void;
}
