import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    create(createCinemaDto: CreateCinemaDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<any>;
    remove(id: string): Promise<any>;
}
