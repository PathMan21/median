import { Routes } from '@angular/router';

export const FILMS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/films/films.component').then(m => m.FilmsPageComponent)
    }
];
