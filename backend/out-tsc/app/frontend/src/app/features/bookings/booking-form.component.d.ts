import { EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
import { CreateBookingRequest } from '../../core/models/booking.model';
export declare class BookingFormComponent implements OnChanges {
    private fb;
    isOpen: boolean;
    films: Film[];
    cinemas: Cinema[];
    preselectedFilmId: number | null;
    userId: number;
    loading: boolean;
    error: string;
    save: EventEmitter<CreateBookingRequest>;
    cancel: EventEmitter<void>;
    form: FormGroup;
    constructor(fb: FormBuilder);
    ngOnChanges(): void;
    submit(): void;
}
