import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest } from '../models/booking.model';
export declare class BookingService {
    private http;
    private base;
    constructor(http: HttpClient);
    getAll(): Observable<Booking[]>;
    getByUser(userId: number): Observable<Booking[]>;
    getOne(id: number): Observable<Booking>;
    create(body: CreateBookingRequest): Observable<Booking>;
    confirm(id: number): Observable<Booking>;
    cancel(id: number): Observable<Booking>;
    delete(id: number): Observable<Booking>;
}
