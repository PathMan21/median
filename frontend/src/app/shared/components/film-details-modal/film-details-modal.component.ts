import { Component, OnInit, signal, effect, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmModalService } from '../../../core/services/film-modal.service';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { CinemaService } from '../../../core/services/cinema.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cinema } from '../../../core/models/cinema.model';

@Component({
    selector: 'app-film-details-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DurationPipe],
    templateUrl: './film-details-modal.component.html',
    styleUrl: './film-details-modal.component.scss'
})
export class FilmDetailsModalComponent implements OnInit {
    modalSvc = inject(FilmModalService);
    cinemaSvc = inject(CinemaService);
    bookingSvc = inject(BookingService);
    auth = inject(AuthService);

    cinemas = signal<Cinema[]>([]);
    selectedCinemaId = signal<number | null>(null);
    seats = signal<number>(1);
    bookingDate = signal<string>(new Date().toISOString().split('T')[0]);
    isBooking = signal(false);
    bookingSuccess = signal(false);

    currentStep = signal(1); 
    showBooking = signal(false);

    startInBookingMode = input<boolean>(false);

    selectedTime = signal<string | null>(null);
    sessionTimes = ['14:30', '17:00', '19:45', '22:15'];

    constructor() {
        effect(() => {
            const film = this.modalSvc.selectedFilm();

            this.showBooking.set(this.startInBookingMode());
            this.currentStep.set(1);
            this.selectedCinemaId.set(null);
            this.seats.set(1);
            this.bookingSuccess.set(false);
            this.isBooking.set(false);
        }, { allowSignalWrites: true });
    }

    ngOnInit(): void {
        this.cinemaSvc.getAll().subscribe((c: Cinema[]) => this.cinemas.set(c));
    }

    startBooking() {
        this.showBooking.set(true);
    }

    close(): void {
        this.modalSvc.close();
        this.bookingSuccess.set(false);
        this.currentStep.set(1);
        this.selectedCinemaId.set(null);
        this.seats.set(1);
    }

    nextStep() {
        if (this.currentStep() < 2) {
            this.currentStep.update(s => s + 1);
        }
    }

    prevStep() {
        if (this.currentStep() > 1) {
            this.currentStep.update(s => s - 1);
        }
    }

    confirmBooking() {
        const film = this.modalSvc.selectedFilm();
        const cinemaId = this.selectedCinemaId();
        const user = this.auth.currentUser();

        if (!film || !cinemaId || !user) return;

        this.isBooking.set(true);

        this.bookingSvc.create({
            userId: user.id,
            filmId: film.id,
            cinemaId: Number(cinemaId),
            bookingDate: this.bookingDate(),
            numberOfSeats: this.seats(),
            totalPrice: this.seats() * 12
        }).subscribe({
            next: () => {
                this.isBooking.set(false);
                this.bookingSuccess.set(true);
                this.currentStep.set(3); 
            },
            error: () => this.isBooking.set(false)
        });
    }
}
