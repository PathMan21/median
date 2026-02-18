import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<any>;
    findAll(): Promise<any>;
    findByUserId(userId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<any>;
    confirm(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
