import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Cinema, CreateCinemaRequest } from '../../../../core/models/cinema.model';

@Component({
    selector: 'app-cinema-form',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, ModalComponent],
    templateUrl: './cinema-form.component.html',
    styleUrls: ['./cinema-form.component.scss']
})
export class CinemaFormComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() cinema: Cinema | null = null;
    @Input() loading = false;
    @Input() error = '';
    @Output() save = new EventEmitter<CreateCinemaRequest>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup;
    editMode = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            phone: ['', Validators.required],
            capacity: [null, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnChanges(): void {
        this.editMode = !!this.cinema;
        if (this.cinema) this.form.patchValue(this.cinema);
        else this.form.reset();
    }

    submit(): void {
        if (this.form.invalid) return;
        const v = this.form.value;
        this.save.emit({ ...v, capacity: Number(v.capacity) });
    }
}
