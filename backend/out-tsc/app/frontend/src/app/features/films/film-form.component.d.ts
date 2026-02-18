import { EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Film, CreateFilmRequest } from '../../core/models/film.model';
export declare class FilmFormComponent implements OnChanges {
    private fb;
    isOpen: boolean;
    film: Film | null;
    loading: boolean;
    error: string;
    save: EventEmitter<CreateFilmRequest>;
    cancel: EventEmitter<void>;
    form: FormGroup;
    editMode: boolean;
    constructor(fb: FormBuilder);
    ngOnChanges(): void;
    submit(): void;
}
