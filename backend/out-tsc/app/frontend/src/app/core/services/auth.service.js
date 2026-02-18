"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const router_1 = require("@angular/router");
const rxjs_1 = require("rxjs");
const environment_1 = require("../../../environments/environment");
let AuthService = class AuthService {
    http;
    router;
    TOKEN_KEY = 'median_token';
    USER_KEY = 'median_user';
    _currentUser = (0, core_1.signal)(this.loadUser());
    _token = (0, core_1.signal)(this.loadToken());
    currentUser = this._currentUser.asReadonly();
    isLoggedIn = (0, core_1.computed)(() => this._currentUser() !== null);
    isAdmin = (0, core_1.computed)(() => this._currentUser()?.roles.includes('admin') ?? false);
    constructor(http, router) {
        this.http = http;
        this.router = router;
    }
    login(body) {
        return this.http.post(`${environment_1.environment.apiUrl}/token`, body).pipe((0, rxjs_1.tap)(res => {
            this._token.set(res.accessToken);
            sessionStorage.setItem(this.TOKEN_KEY, res.accessToken);
        }), (0, rxjs_1.switchMap)(res => {
            const decoded = JSON.parse(atob(res.accessToken));
            return this.http.get(`${environment_1.environment.apiUrl}/account/${decoded.sub}`);
        }), (0, rxjs_1.tap)(user => {
            this._currentUser.set(user);
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }));
    }
    register(body) {
        return this.http.post(`${environment_1.environment.apiUrl}/account`, {
            ...body,
            roles: ['user']
        });
    }
    logout() {
        this._currentUser.set(null);
        this._token.set(null);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        this.router.navigate(['/']);
    }
    getToken() {
        return this._token();
    }
    loadToken() {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }
    loadUser() {
        try {
            const raw = sessionStorage.getItem(this.USER_KEY);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' }),
    __metadata("design:paramtypes", [http_1.HttpClient, router_1.Router])
], AuthService);
//# sourceMappingURL=auth.service.js.map