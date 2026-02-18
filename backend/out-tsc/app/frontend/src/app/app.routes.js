"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_guard_1 = require("./core/guards/auth.guard");
exports.routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'films',
        loadComponent: () => import('./pages/films/films.component').then(m => m.FilmsPageComponent)
    },
    {
        path: 'cinemas',
        loadComponent: () => import('./pages/cinemas/cinemas.component').then(m => m.CinemasPageComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsPageComponent),
        canActivate: [auth_guard_1.authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    { path: '**', redirectTo: '' }
];
//# sourceMappingURL=app.routes.js.map