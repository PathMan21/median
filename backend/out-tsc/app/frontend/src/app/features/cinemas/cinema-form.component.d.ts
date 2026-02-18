import { EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Cinema, CreateCinemaRequest } from '../../core/models/cinema.model';
export declare class CinemaFormComponent implements OnChanges {
    private fb;
    isOpen: boolean;
    cinema: Cinema | null;
    loading: boolean;
    error: string;
    save: EventEmitter<CreateCinemaRequest>;
    cancel: EventEmitter<void>;
    form: FormGroup;
    editMode: boolean;
    constructor(fb: FormBuilder);
    ngOnChanges(): void;
    submit(): void;
}
