import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService, UploadedFile } from '../storage/storage.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    return this.prisma.film.create({
      data: createFilmDto,
    });
  }

  async findAll() {
    return this.prisma.film.findMany();
  }

  async findOne(id: number) {
    return this.prisma.film.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    return this.prisma.film.update({
      where: { id },
      data: updateFilmDto,
    });
  }

  async remove(id: number) {
    return this.prisma.film.delete({
      where: { id },
    });
  }

  async uploadPoster(id: number, file: UploadedFile) {
    if (!file) {
      throw new BadRequestException('Fichier "file" manquant');
    }

    const film = await this.prisma.film.findUnique({ where: { id } });
    if (!film) {
      throw new NotFoundException(`Film ${id} introuvable`);
    }

    const posterUrl = await this.storage.upload(file, `films/${id}/`);

    return this.prisma.film.update({
      where: { id },
      data: { posterUrl },
    });
  }
}
