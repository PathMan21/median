import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film, CreateFilmRequest, UpdateFilmRequest } from '../models/film.model';
export declare class FilmService {
    private http;
    private base;
    constructor(http: HttpClient);
    getAll(): Observable<Film[]>;
    getOne(id: number): Observable<Film>;
    create(body: CreateFilmRequest): Observable<Film>;
    update(id: number, body: UpdateFilmRequest): Observable<Film>;
    delete(id: number): Observable<Film>;
}
