import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private base = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.base);
  }

  getByUser(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/user/${userId}`);
  }

  getOne(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/${id}`);
  }

  create(body: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.base, body);
  }

  confirm(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/${id}/confirm`, {});
  }

  cancel(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/${id}/cancel`, {});
  }

  delete(id: number): Observable<Booking> {
    return this.http.delete<Booking>(`${this.base}/${id}`);
  }
}
