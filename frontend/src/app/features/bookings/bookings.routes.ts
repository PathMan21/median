import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const BOOKINGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsPageComponent),
        canActivate: [authGuard]
    }
];
