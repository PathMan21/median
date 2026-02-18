import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
export declare class FilmsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFilmDto: CreateFilmDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateFilmDto: UpdateFilmDto): Promise<any>;
    remove(id: number): Promise<any>;
}
