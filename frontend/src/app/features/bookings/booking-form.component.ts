import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
import { CreateBookingRequest } from '../../core/models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" (close)="cancel.emit()">
      <div class="form-title">Nouvelle réservation</div>
      <div class="form-sub">Remplissez les informations de séance</div>

      <app-alert [message]="error" type="error"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Film</label>
          <select formControlName="filmId">
            <option value="">— Sélectionner un film —</option>
            <option *ngFor="let f of films" [value]="f.id">{{ f.title }}</option>
          </select>
        </div>
        <div class="field">
          <label>Cinéma</label>
          <select formControlName="cinemaId">
            <option value="">— Sélectionner un cinéma —</option>
            <option *ngFor="let c of cinemas" [value]="c.id">{{ c.name }} ({{ c.city }})</option>
          </select>
        </div>
        <div class="field">
          <label>Date de séance</label>
          <input formControlName="bookingDate" type="datetime-local" />
        </div>
        <div class="field">
          <label>Nombre de sièges</label>
          <input formControlName="numberOfSeats" type="number" min="1" max="20" />
        </div>
        <div class="field">
          <label>Prix total (€)</label>
          <input formControlName="totalPrice" type="number" step="0.01" min="0" placeholder="ex: 25.00" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-gold" [disabled]="form.invalid || loading">
            {{ loading ? 'En cours…' : 'Réserver' }}
          </button>
          <button type="button" class="btn btn-outline" (click)="cancel.emit()">Annuler</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; }
    .form-sub   { color: var(--text-dim); font-size: 11px; margin-bottom: 1.5rem; letter-spacing: 0.08em; }
    .form-actions { display: flex; gap: 0.8rem; margin-top: 1.5rem; }
    .form-actions .btn { flex: 1; justify-content: center; }
  `]
})
export class BookingFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() films: Film[] = [];
  @Input() cinemas: Cinema[] = [];
  @Input() preselectedFilmId: number | null = null;
  @Input() userId!: number;
  @Input() loading = false;
  @Input() error = '';
  @Output() save   = new EventEmitter<CreateBookingRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      filmId:        ['', Validators.required],
      cinemaId:      ['', Validators.required],
      bookingDate:   ['', Validators.required],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
      totalPrice:    [null, [Validators.required, Validators.min(0)]],
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
