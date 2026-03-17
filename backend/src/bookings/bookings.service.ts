import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        bookingDate: new Date(createBookingDto.bookingDate),
        status: BookingStatus.CONFIRMED,
      },
      include: {
        film: true,  
        cinema: true, 
        user: {
          select: { login: true, email: true }, 
        },
      },
    });

    await this.mailService.sendBookingConfirmation({
      to: booking.user.email,
      login: booking.user.login,
      bookingId: booking.id,
      filmTitle: booking.film.title,
      filmGenre: booking.film.genre,
      filmDuration: booking.film.duration,
      filmDescription: booking.film.description,
      filmPosterUrl: booking.film.posterUrl || '',
      cinemaName: booking.cinema.name,
      cinemaCity: booking.cinema.city,
      bookingDate: booking.bookingDate,
      numberOfSeats: booking.numberOfSeats,
      totalPrice: booking.totalPrice,
    });

    return booking;
  }

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async findByUserId(userId: number) {
    return this.prisma.booking.findMany({ where: { userId } });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    return this.prisma.booking.update({ where: { id }, data: updateBookingDto });
  }

  async confirm(id: number) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED },
    });
  }

  async cancel(id: number) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  async remove(id: number) {
    return this.prisma.booking.delete({ where: { id } });
  }
}