import { BookingStatus } from '../entities/booking.entity';
export declare class UpdateBookingDto {
    bookingDate?: Date;
    numberOfSeats?: number;
    totalPrice?: number;
    status?: BookingStatus;
}
