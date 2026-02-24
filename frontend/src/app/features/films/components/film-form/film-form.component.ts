import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Film, CreateFilmRequest } from '../../../../core/models/film.model';

@Component({
    selector: 'app-film-form',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, ModalComponent],
    templateUrl: './film-form.component.html',
    styleUrls: ['./film-form.component.scss']
})
export class FilmFormComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() film: Film | null = null;
    @Input() loading = false;
    @Input() error = '';
    @Output() save = new EventEmitter<CreateFilmRequest>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup;
    editMode = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            genre: ['', Validators.required],
            description: ['', Validators.required],
            duration: [null, [Validators.required, Validators.min(1)]],
            releaseDate: ['', Validators.required],
        });
    }

    ngOnChanges(): void {
        this.editMode = !!this.film;
        if (this.film) {
            this.form.patchValue({
                ...this.film,
                releaseDate: this.film.releaseDate.substring(0, 10)
            });
        } else {
            this.form.reset();
        }
    }

    submit(): void {
        if (this.form.invalid) return;
        const v = this.form.value;
        this.save.emit({
            ...v,
            duration: Number(v.duration),
            releaseDate: new Date(v.releaseDate).toISOString()
        });
    }
}
