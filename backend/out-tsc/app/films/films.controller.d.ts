import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
export declare class FilmsController {
    private readonly filmsService;
    constructor(filmsService: FilmsService);
    create(createFilmDto: CreateFilmDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateFilmDto: UpdateFilmDto): Promise<any>;
    remove(id: string): Promise<any>;
}
