import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Film, CreateFilmRequest, UpdateFilmRequest } from '../models/film.model';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private base = `${environment.apiUrl}/films`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Film[]> {
    return this.http.get<Film[]>(this.base);
  }

  getOne(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.base}/${id}`);
  }

  create(body: CreateFilmRequest): Observable<Film> {
    return this.http.post<Film>(this.base, body);
  }

  update(id: number, body: UpdateFilmRequest): Observable<Film> {
    return this.http.patch<Film>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<Film> {
    return this.http.delete<Film>(`${this.base}/${id}`);
  }
}
