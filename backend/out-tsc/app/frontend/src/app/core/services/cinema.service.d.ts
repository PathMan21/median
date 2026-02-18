import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cinema, CreateCinemaRequest, UpdateCinemaRequest } from '../models/cinema.model';
export declare class CinemaService {
    private http;
    private base;
    constructor(http: HttpClient);
    getAll(): Observable<Cinema[]>;
    getOne(id: number): Observable<Cinema>;
    create(body: CreateCinemaRequest): Observable<Cinema>;
    update(id: number, body: UpdateCinemaRequest): Observable<Cinema>;
    delete(id: number): Observable<Cinema>;
}
