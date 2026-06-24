import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autorise les appels cross-origin du frontend (domaines ACA distincts)
  app.enableCors();

  // Toutes les routes d'API sont préfixées par /api (ex: /api/films)
  app.setGlobalPrefix('api');

  // Validation globale des DTOs.
  // transform: true uniquement — les DTOs n'ont pas (encore) de décorateurs
  // class-validator, donc whitelist/forbidNonWhitelisted rejetteraient tout.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth() // Ajoute le champ Authorization dans Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI servi sur /docs (l'API, elle, est sous /api)
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
void bootstrap();
