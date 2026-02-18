import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    findByUserId(userId: number): Promise<any>;
    update(id: number, updateBookingDto: UpdateBookingDto): Promise<any>;
    confirm(id: number): Promise<any>;
    cancel(id: number): Promise<any>;
    remove(id: number): Promise<any>;
}
