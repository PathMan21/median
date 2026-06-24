export class CreateBookingDto {
  userId: number;
  filmId: number;
  cinemaId: number;
  bookingDate: Date;
  numberOfSeats: number;
  totalPrice: number;
}
