"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
class Booking {
    id;
    userId;
    filmId;
    cinemaId;
    bookingDate;
    numberOfSeats;
    totalPrice;
    status;
    createdAt;
    updatedAt;
}
exports.Booking = Booking;
//# sourceMappingURL=booking.entity.js.map