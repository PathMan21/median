export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Booking {
    id: number;
    userId: number;
    filmId: number;
    cinemaId: number;
    bookingDate: Date;
    numberOfSeats: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}
