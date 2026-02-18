import { Film } from './film.model';
import { Cinema } from './cinema.model';
import { User } from './user.model';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export interface Booking {
    id: number;
    userId: number;
    filmId: number;
    cinemaId: number;
    bookingDate: string;
    numberOfSeats: number;
    totalPrice: number;
    status: BookingStatus;
    film?: Film;
    cinema?: Cinema;
    user?: User;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBookingRequest {
    userId: number;
    filmId: number;
    cinemaId: number;
    bookingDate: string;
    numberOfSeats: number;
    totalPrice: number;
}
