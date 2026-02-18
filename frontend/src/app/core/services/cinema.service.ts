import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cinema, CreateCinemaRequest, UpdateCinemaRequest } from '../models/cinema.model';

@Injectable({ providedIn: 'root' })
export class CinemaService {
  private base = `${environment.apiUrl}/cinemas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.base);
  }

  getOne(id: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${this.base}/${id}`);
  }

  create(body: CreateCinemaRequest): Observable<Cinema> {
    return this.http.post<Cinema>(this.base, body);
  }

  update(id: number, body: UpdateCinemaRequest): Observable<Cinema> {
    return this.http.patch<Cinema>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<Cinema> {
    return this.http.delete<Cinema>(`${this.base}/${id}`);
  }
}
