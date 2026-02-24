import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'films',
    loadChildren: () => import('./features/films/films.routes').then(m => m.FILMS_ROUTES)
  },
  {
    path: 'cinemas',
    loadChildren: () => import('./features/cinemas/cinemas.routes').then(m => m.CINEMAS_ROUTES)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
