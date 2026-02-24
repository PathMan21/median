import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../../../core/services/booking.service';
import { FilmService } from '../../../../core/services/film.service';
import { CinemaService } from '../../../../core/services/cinema.service';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { Booking } from '../../../../core/models/booking.model';
import { Film } from '../../../../core/models/film.model';
import { Cinema } from '../../../../core/models/cinema.model';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, BookingFormComponent, BadgeComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsPageComponent implements OnInit {
  auth = inject(AuthService);
  private bookingSvc = inject(BookingService);
  private filmSvc = inject(FilmService);
  private cinemaSvc = inject(CinemaService);

  bookings: Booking[] = [];
  films: Film[] = [];
  cinemas: Cinema[] = [];
  loading = true;

  formOpen = false;
  formLoading = false;
  formError = '';

  ngOnInit(): void {
    forkJoin({
      films: this.filmSvc.getAll(),
      cinemas: this.cinemaSvc.getAll(),
    }).subscribe({ next: ({ films, cinemas }) => { this.films = films; this.cinemas = cinemas; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    const obs = this.auth.isAdmin()
      ? this.bookingSvc.getAll()
      : this.bookingSvc.getByUser(this.auth.currentUser()!.id);

    obs.subscribe({
      next: b => { this.bookings = b; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getTotalSpent(): number {
    return this.bookings
      .filter(b => b.status !== 'CANCELLED')
      .reduce((acc, b) => acc + b.totalPrice, 0);
  }

  openForm(): void { this.formError = ''; this.formOpen = true; }

  onSave(req: any): void {
    this.formLoading = true;
    this.formError = '';
    this.bookingSvc.create(req).subscribe({
      next: () => { this.formLoading = false; this.formOpen = false; this.load(); },
      error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
    });
  }

  confirm(b: Booking): void {
    this.bookingSvc.confirm(b.id).subscribe({ next: () => this.load(), error: () => { } });
  }

  cancel(b: Booking): void {
    if (!confirm('Annuler cette réservation ?')) return;
    this.bookingSvc.cancel(b.id).subscribe({ next: () => this.load(), error: () => { } });
  }
}
