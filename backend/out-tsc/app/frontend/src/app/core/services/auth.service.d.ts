import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, LoginRequest, CreateAccountRequest } from '../models/user.model';
export declare class AuthService {
    private http;
    private router;
    private readonly TOKEN_KEY;
    private readonly USER_KEY;
    private _currentUser;
    private _token;
    readonly currentUser: import("@angular/core", { with: { "resolution-mode": "import" } }).Signal<User | null>;
    readonly isLoggedIn: import("@angular/core", { with: { "resolution-mode": "import" } }).Signal<boolean>;
    readonly isAdmin: import("@angular/core", { with: { "resolution-mode": "import" } }).Signal<boolean>;
    constructor(http: HttpClient, router: Router);
    login(body: LoginRequest): Observable<User>;
    register(body: CreateAccountRequest): Observable<User>;
    logout(): void;
    getToken(): string | null;
    private loadToken;
    private loadUser;
}
