import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { Film } from '../../core/models/film.model';
import { Cinema } from '../../core/models/cinema.model';
import { CreateBookingRequest } from '../../core/models/booking.model';

interface Seat {
  id: string;
  row: string;
  number: number;
  selected: boolean;
  available: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DaySlot {
  date: Date;
  dateStr: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" (close)="cancel.emit()">
      <div class="booking-container">
        <div class="booking-header">
          <h2>Nouvelle Réservation</h2>
          <p>Sélectionnez vos places de cinéma</p>
        </div>

        <app-alert [message]="error" type="error"></app-alert>

        <form [formGroup]="form">
          <!-- Étape 1: Film & Cinéma -->
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>Film</label>
                <select formControlName="filmId" (change)="onFilmChange()">
                  <option value="">— Sélectionner un film —</option>
                  <option *ngFor="let f of films" [value]="f.id">{{ f.title }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Cinéma</label>
                <select formControlName="cinemaId" (change)="onCinemaChange()">
                  <option value="">— Sélectionner un cinéma —</option>
                  <option *ngFor="let c of cinemas" [value]="c.id">{{ c.name }} ({{ c.city }})</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Étape 2: Jour de séance -->
          <div class="form-section" *ngIf="form.get('filmId')?.value && form.get('cinemaId')?.value">
            <label class="section-title">Jour de séance</label>
            <div class="days-grid">
              <button
                type="button"
                *ngFor="let day of availableDays"
                class="day-button"
                [class.selected]="day.selected"
                (click)="selectDay(day)"
                [disabled]="loading"
              >
                <div class="day-label">{{ day.label }}</div>
                <div class="day-date">{{ day.dateStr }}</div>
              </button>
            </div>
          </div>

          <!-- Étape 3: Horaire -->
          <div class="form-section" *ngIf="selectedDay">
            <label class="section-title">Horaire de séance</label>
            <div class="times-grid">
              <button
                type="button"
                *ngFor="let time of availableTimes"
                class="time-button"
                [class.selected]="selectedTime === time.id"
                [class.unavailable]="!time.available"
                [disabled]="!time.available || loading"
                (click)="selectTime(time)"
              >
                {{ time.time }}
              </button>
            </div>
          </div>

          <!-- Étape 4: Sélection des places -->
          <div class="form-section" *ngIf="selectedDay && selectedTime">
            <label class="section-title">Sélectionnez vos places</label>
            <div class="screen-label">ÉCRAN</div>
            <div class="seats-grid">
              <div *ngFor="let row of getRows()" class="seat-row">
                <span class="row-letter">{{ row }}</span>
                <div class="seat-buttons">
                  <button
                    type="button"
                    *ngFor="let seat of getSeatsByRow(row)"
                    class="seat"
                    [class.selected]="seat.selected"
                    [class.unavailable]="!seat.available"
                    [disabled]="!seat.available || loading"
                    (click)="toggleSeat(seat)"
                  >
                    {{ seat.number }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Légende -->
            <div class="seats-legend">
              <div class="legend-item">
                <div class="seat-icon"></div>
                <span>Disponible</span>
              </div>
              <div class="legend-item">
                <div class="seat-icon selected"></div>
                <span>Sélectionné</span>
              </div>
              <div class="legend-item">
                <div class="seat-icon unavailable"></div>
                <span>Indisponible</span>
              </div>
            </div>

            <!-- Résumé -->
            <div class="booking-summary">
              <div class="summary-row">
                <span>Jour & heure</span>
                <strong>{{ selectedDay.dateStr }} à {{ selectedTime }}</strong>
              </div>
              <div class="summary-row">
                <span>Places sélectionnées</span>
                <strong>{{ selectedSeats.length }}</strong>
              </div>
              <div class="summary-row">
                <span>Prix unitaire</span>
                <strong>14.00€</strong>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <strong>{{ (selectedSeats.length * 14).toFixed(2) }}€</strong>
              </div>
            </div>
          </div>

          <!-- Boutons -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancel.emit()">Annuler</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              (click)="submit()"
              [disabled]="selectedSeats.length === 0 || !selectedDay || !selectedTime || loading"
            >
              {{ loading ? 'En cours…' : 'Confirmer la Réservation' }}
            </button>
          </div>
        </form>
      </div>
    </app-modal>
  `,
  styles: [`
    .booking-container { padding: 1.5rem; }
    .booking-header { margin-bottom: 1.5rem; }
    .booking-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.3rem; }
    .booking-header p { font-size: 0.875rem; color: var(--text-dim); }

    .form-section { margin: 1.5rem 0; }
    .section-title { display: block; font-weight: 600; margin-bottom: 1rem; font-size: 0.95rem; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; }
    .form-group select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; }

    .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
    .day-button { padding: 0.75rem; border: 2px solid #ddd; background: white; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; }
    .day-button:hover:not(:disabled) { border-color: var(--accent-gold); background: #faf8f3; }
    .day-button.selected { background: var(--accent-gold); color: white; border-color: var(--accent-gold); }
    .day-label { font-weight: 600; font-size: 0.85rem; }
    .day-date { font-size: 0.75rem; opacity: 0.8; }

    .times-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.6rem; }
    .time-button { padding: 0.6rem; border: 2px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .time-button:hover:not(:disabled) { border-color: var(--accent-gold); background: #faf8f3; }
    .time-button.selected { background: var(--accent-gold); color: white; border-color: var(--accent-gold); }
    .time-button.unavailable { background: #f0f0f0; color: #ccc; cursor: not-allowed; border-color: #ddd; }

    .screen-label { text-align: center; font-weight: 600; color: var(--text-dim); margin-bottom: 1rem; }
    .seats-grid { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
    .seat-row { display: flex; align-items: center; gap: 0.5rem; }
    .row-letter { width: 25px; font-weight: 600; text-align: center; }
    .seat-buttons { display: flex; gap: 0.3rem; flex-wrap: wrap; flex: 1; }
    .seat { width: 30px; height: 30px; border: 2px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 0.7rem; font-weight: 600; transition: all 0.2s; }
    .seat:hover:not(:disabled) { border-color: var(--accent-gold); background: #faf8f3; }
    .seat.selected { background: var(--accent-gold); color: white; border-color: var(--accent-gold); }
    .seat.unavailable { background: #f0f0f0; color: #ccc; cursor: not-allowed; }

    .seats-legend { display: flex; gap: 1.5rem; justify-content: center; margin: 1rem 0; font-size: 0.85rem; }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; }
    .seat-icon { width: 20px; height: 20px; border: 1px solid #ddd; border-radius: 3px; background: white; }
    .seat-icon.selected { background: var(--accent-gold); border-color: var(--accent-gold); }
    .seat-icon.unavailable { background: #f0f0f0; border-color: #ddd; }

    .booking-summary { background: #faf8f3; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.9rem; }
    .summary-row.total { border-top: 1px solid #ddd; padding-top: 0.75rem; margin-top: 0.5rem; font-size: 1rem; color: var(--accent-gold); font-weight: 700; }

    .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .form-actions button { flex: 1; padding: 0.75rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-primary { background: var(--accent-gold); color: white; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { border: 1px solid #ddd; background: white; color: var(--text-primary); }
    .btn-secondary:hover { background: #f5f5f5; }

    @media (max-width: 768px) {
      .days-grid { grid-template-columns: repeat(4, 1fr); }
      .form-row { grid-template-columns: 1fr; }
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
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  availableDays: DaySlot[] = [];
  availableTimes: TimeSlot[] = [];
  selectedDay: DaySlot | null = null;
  selectedTime: string | null = null;
  private pricePerSeat = 14.00;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      filmId: ['', Validators.required],
      cinemaId: ['', Validators.required],
    });
    this.initializeSeats();
    this.initializeDays();
    this.initializeTimes();
  }

  ngOnChanges(): void {
    if (this.preselectedFilmId) {
      this.form.patchValue({ filmId: this.preselectedFilmId });
    }
    if (!this.isOpen) {
      this.form.reset();
      this.resetSeats();
      this.selectedDay = null;
      this.selectedTime = null;
      this.availableDays.forEach((d) => (d.selected = false));
    }
  }

  private initializeSeats(): void {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 10;
    const unavailableSeats = ['A5', 'B2', 'C8', 'D3', 'F9'];

    this.seats = [];
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        this.seats.push({
          id: seatId,
          row,
          number: i,
          selected: false,
          available: !unavailableSeats.includes(seatId),
        });
      }
    });
  }

  private initializeDays(): void {
    this.availableDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const monthNames = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      const dayName = dayNames[date.getDay()];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const label = i === 0 ? 'Aujourd\'hui' : i === 1 ? 'Demain' : dayName.substring(0, 3);
      const dateStr = `${day} ${month}`;

      this.availableDays.push({
        date,
        dateStr,
        label,
        selected: false,
      });
    }
  }

  private initializeTimes(): void {
    const times = ['09:00', '10:30', '12:00', '14:30', '16:00', '18:00', '20:00', '21:30'];
    const unavailableTimes = ['10:30', '21:30'];

    this.availableTimes = times.map((time) => ({
      id: time,
      time,
      available: !unavailableTimes.includes(time),
    }));
  }

  private resetSeats(): void {
    this.seats.forEach((seat) => (seat.selected = false));
    this.selectedSeats = [];
  }

  getRows(): string[] {
    return Array.from(new Set(this.seats.map((s) => s.row))).sort();
  }

  getSeatsByRow(row: string): Seat[] {
    return this.seats.filter((s) => s.row === row);
  }

  selectDay(day: DaySlot): void {
    this.availableDays.forEach((d) => (d.selected = false));
    day.selected = true;
    this.selectedDay = day;
    this.selectedTime = null;
    this.resetSeats();
  }

  selectTime(time: TimeSlot): void {
    if (!time.available) return;
    this.selectedTime = time.id;
    this.resetSeats();
  }

  toggleSeat(seat: Seat): void {
    if (!seat.available) return;
    seat.selected = !seat.selected;
    this.selectedSeats = this.seats.filter((s) => s.selected);
  }

  onFilmChange(): void {
    this.selectedDay = null;
    this.selectedTime = null;
    this.availableDays.forEach((d) => (d.selected = false));
    this.resetSeats();
  }

  onCinemaChange(): void {
    this.selectedDay = null;
    this.selectedTime = null;
    this.availableDays.forEach((d) => (d.selected = false));
    this.resetSeats();
  }

  submit(): void {
    if (
      this.form.invalid ||
      this.selectedSeats.length === 0 ||
      !this.selectedDay ||
      !this.selectedTime
    ) {
      return;
    }

    const [hours, minutes] = this.selectedTime.split(':').map(Number);
    const bookingDateTime = new Date(this.selectedDay.date);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const v = this.form.value;
    this.save.emit({
      userId: this.userId,
      filmId: Number(v.filmId),
      cinemaId: Number(v.cinemaId),
      bookingDate: bookingDateTime.toISOString(),
      numberOfSeats: this.selectedSeats.length,
      totalPrice: this.selectedSeats.length * this.pricePerSeat,
    });
  }
}

