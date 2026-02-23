// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.upsert({
    where: { login: 'john_doe' },
    update: {},
    create: {
      login: 'john_doe',
      password: 'password123',
      roles: ['USER'],
      status: 'open',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { login: 'jane_smith' },
    update: {},
    create: {
      login: 'jane_smith',
      password: 'password456',
      roles: ['USER', 'ADMIN'],
      status: 'open',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { login: 'bob_wilson' },
    update: {},
    create: {
      login: 'bob_wilson',
      password: 'password789',
      roles: ['USER'],
      status: 'open',
    },
  });


  const film1 = await prisma.film.create({
    data: {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      duration: 148,
      releaseDate: new Date('2010-07-16'),
      genre: 'Sci-Fi',
    },
  });

  const film2 = await prisma.film.create({
    data: {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      duration: 152,
      releaseDate: new Date('2008-07-18'),
      genre: 'Action',
    },
  });

  const film3 = await prisma.film.create({
    data: {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      duration: 169,
      releaseDate: new Date('2014-11-07'),
      genre: 'Sci-Fi',
    },
  });

  const film4 = await prisma.film.create({
    data: {
      title: 'The Shawshank Redemption',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      duration: 142,
      releaseDate: new Date('1994-10-14'),
      genre: 'Drama',
    },
  });

  const cinema1 = await prisma.cinema.create({
    data: {
      name: 'CinÃ©ma Palace',
      address: '123 Main Street',
      city: 'Paris',
      phone: '01 23 45 67 89',
      capacity: 500,
    },
  });

  // Create bookings
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      filmId: film1.id,
      cinemaId: cinema1.id,
      bookingDate: new Date('2026-03-01'),
      numberOfSeats: 2,
      totalPrice: 28.00,
      status: 'CONFIRMED',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      filmId: film2.id,
      cinemaId: cinema1.id,
      bookingDate: new Date('2026-03-05'),
      numberOfSeats: 3,
      totalPrice: 39.00,
      status: 'PENDING',
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      userId: user3.id,
      filmId: film3.id,
      cinemaId: cinema1.id,
      bookingDate: new Date('2026-03-10'),
      numberOfSeats: 1,
      totalPrice: 14.00,
      status: 'CONFIRMED',
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      userId: user1.id,
      filmId: film4.id,
      cinemaId: cinema1.id,
      bookingDate: new Date('2026-03-15'),
      numberOfSeats: 4,
      totalPrice: 48.00,
      status: 'CONFIRMED',
    },
  });

  console.log({
    users: [user1, user2, user3],
    films: [film1, film2, film3, film4],
    cinemas: [cinema1],
    bookings: [booking1, booking2, booking3, booking4],
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });