import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Film } from '../../../../core/models/film.model';
import { Cinema } from '../../../../core/models/cinema.model';
import { CreateBookingRequest } from '../../../../core/models/booking.model';

@Component({
    selector: 'app-booking-form',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, ModalComponent],
    templateUrl: './booking-form.component.html',
    styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() films: Film[] = [];
    @Input() cinemas: Cinema[] = [];
    @Input() preselectedFilmId: number | null = null;
    @Input() userId!: number;
    @Input() loading = false;
    @Input() error = '';
    @Output() save = new EventEmitter<CreateBookingRequest>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            filmId: ['', Validators.required],
            cinemaId: ['', Validators.required],
            bookingDate: ['', Validators.required],
            numberOfSeats: [1, [Validators.required, Validators.min(1)]],
            totalPrice: [null, [Validators.required, Validators.min(0)]],
        });
    }

    ngOnChanges(): void {
        if (this.preselectedFilmId) {
            this.form.patchValue({ filmId: this.preselectedFilmId });
        }
        if (!this.isOpen) this.form.reset({ numberOfSeats: 1 });
    }

    submit(): void {
        if (this.form.invalid) return;
        const v = this.form.value;
        this.save.emit({
            userId: this.userId,
            filmId: Number(v.filmId),
            cinemaId: Number(v.cinemaId),
            bookingDate: new Date(v.bookingDate).toISOString(),
            numberOfSeats: Number(v.numberOfSeats),
            totalPrice: Number(v.totalPrice),
        });
    }
}
