import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { FilmsModule } from './films/films.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { BookingsModule } from './bookings/bookings.module';
import { StorageModule } from './storage/storage.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    EventsModule,
    ArticlesModule,
    AccountModule,
    AuthModule,
    FilmsModule,
    CinemasModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
