import { PrismaService } from '../prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
export declare class CinemasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCinemaDto: CreateCinemaDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateCinemaDto: UpdateCinemaDto): Promise<any>;
    remove(id: number): Promise<any>;
}
