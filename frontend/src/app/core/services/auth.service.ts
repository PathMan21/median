import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, TokenResponse, LoginRequest, CreateAccountRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'median_token';
  private readonly USER_KEY  = 'median_user';

  private _currentUser = signal<User | null>(this.loadUser());
  private _token       = signal<string | null>(this.loadToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => this._currentUser() !== null);
  readonly isAdmin     = computed(() => this._currentUser()?.roles.includes('admin') ?? false);

  constructor(private http: HttpClient, private router: Router) {}

  login(body: LoginRequest): Observable<User> {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/token`, body).pipe(
      tap(res => {
        this._token.set(res.accessToken);
        sessionStorage.setItem(this.TOKEN_KEY, res.accessToken);
      }),
      switchMap(res => {
        const decoded = JSON.parse(atob(res.accessToken));
        return this.http.get<User>(`${environment.apiUrl}/account/${decoded.sub}`);
      }),
      tap(user => {
        this._currentUser.set(user);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  register(body: CreateAccountRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/account`, {
      ...body,
      roles: ['user']
    });
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._token();
  }

  private loadToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    try {
      const raw = sessionStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
