import { Routes } from '@angular/router';

export const CINEMAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/cinemas/cinemas.component').then(m => m.CinemasPageComponent)
    }
];
