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
      description: 'Un voleur qui subtilise des secrets d\'entreprise à travers le partage de rêves se voit confier la mission inverse : implanter une idée dans l\'esprit d\'un PDG.',
      duration: 148,
      releaseDate: new Date('2010-07-16'),
      genre: 'Sci-Fi',
      rating: 8.8,
      posterUrl: 'https://media.senscritique.com/media/000004710747/0/inception.jpg',
    },
  });

  const film2 = await prisma.film.create({
    data: {
      title: 'The Dark Knight',
      description: 'Quand la menace connue sous le nom de Joker sème le chaos sur Gotham, Batman doit accepter l\'un des plus grands défis psychologiques et physiques.',
      duration: 152,
      releaseDate: new Date('2008-07-18'),
      genre: 'Action',
      rating: 9.0,
      posterUrl: 'https://media.senscritique.com/media/000022933408/300/the_dark_knight_le_chevalier_noir.png',
    },
  });

  const film3 = await prisma.film.create({
    data: {
      title: 'Interstellar',
      description: 'Une équipe d\'explorateurs voyage à travers un trou de ver dans l\'espace pour tenter d\'assurer la survie de l\'humanité.',
      duration: 169,
      releaseDate: new Date('2014-11-07'),
      genre: 'Sci-Fi',
      rating: 8.7,
      posterUrl: 'https://media.senscritique.com/media/000022626458/300/interstellar.png',
    },
  });

  const film4 = await prisma.film.create({
    data: {
      title: 'Dune: Part Two',
      description: 'Paul Atreides s\'unit à Chani et aux Fremen tout en préparant sa revanche contre les conspirateurs qui ont détruit sa famille.',
      duration: 166,
      releaseDate: new Date('2024-02-28'),
      genre: 'Sci-Fi',
      rating: 8.9,
      posterUrl: 'https://media.senscritique.com/media/000021882399/300/dune_deuxieme_partie.png',
    },
  });

  const film5 = await prisma.film.create({
    data: {
      title: 'Oppenheimer',
      description: 'L\'histoire du physicien J. Robert Oppenheimer et son rôle dans la création de la bombe atomique.',
      duration: 180,
      releaseDate: new Date('2023-07-21'),
      genre: 'Drama',
      rating: 8.4,
      posterUrl: 'https://media.senscritique.com/media/000021348116/300/oppenheimer.png',
    },
  });

  const film6 = await prisma.film.create({
    data: {
      title: 'The Batman',
      description: 'Dans sa deuxième année de lutte contre le crime, Batman découvre la corruption à Gotham City tout en traquant le Riddler.',
      duration: 176,
      releaseDate: new Date('2022-03-04'),
      genre: 'Action',
      rating: 7.8,
      posterUrl: 'https://media.senscritique.com/media/000023183010/300/the_batman.png',
    },
  });

  // Create cinemas
  const cinema1 = await prisma.cinema.create({
    data: {
      name: 'Cinéma Palace',
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
      status: 'CONFIRMED',
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
    films: [film1, film2, film3, film4, film5, film6],
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

