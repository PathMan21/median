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
      <div class="booking-form-v2">
        <header class="form-header">
          <h2 class="font-display text-gradient">Réserver ma séance</h2>
          <p class="muted">Sélectionnez vos préférences pour une expérience sur mesure.</p>
        </header>

        <app-alert [message]="error" type="error"></app-alert>

        <form [formGroup]="form" (ngSubmit)="submit()" class="modern-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Film</label>
              <div class="select-wrapper">
                <select formControlName="filmId" class="modern-input">
                  <option value="">Sélectionnez un film</option>
                  <option *ngFor="let f of films" [value]="f.id">{{ f.title }}</option>
                </select>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Établissement</label>
              <div class="select-wrapper">
                <select formControlName="cinemaId" class="modern-input">
                  <option value="">Sélectionnez un cinéma</option>
                  <option *ngFor="let c of cinemas" [value]="c.id">{{ c.name }} — {{ c.city }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Date & Heure</label>
              <input formControlName="bookingDate" type="datetime-local" class="modern-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Nombre de Places</label>
              <input formControlName="numberOfSeats" type="number" min="1" max="20" class="modern-input" />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Prix Total Global (€)</label>
              <div class="price-input-wrapper">
                <span class="currency-tag">EUR</span>
                <input formControlName="totalPrice" type="number" step="0.01" min="0" placeholder="0.00" class="modern-input price-input" />
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button type="button" class="btn btn-outline" (click)="cancel.emit()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
              <span *ngIf="!loading">Confirmer la Réservation</span>
              <span *ngIf="loading" class="loader-dots">Validation...</span>
            </button>
          </div>
        </form>
      </div>
    </app-modal>
  `,
  styles: [`
    .booking-form-v2 {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-header { margin-bottom: 1rem; }
    .muted { color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem; }

    .modern-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .full-width { grid-column: span 2; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modern-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 0.875rem 1rem;
      border-radius: var(--radius-lg);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .modern-input:focus {
      border-color: var(--accent-primary);
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
    }

    .select-wrapper { position: relative; }
    
    select.modern-input {
      appearance: none;
      cursor: pointer;
    }

    .price-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-tag {
      position: absolute;
      left: 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    .price-input { padding-left: 3.5rem !important; }

    .form-footer {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .form-footer button { flex: 1; justify-content: center; }

    .loader-dots { animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    @media (max-width: 480px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: auto; }
    }
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

