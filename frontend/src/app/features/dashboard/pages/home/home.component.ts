import { Component, OnInit, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilmService } from '../../../../core/services/film.service';
import { Film } from '../../../../core/models/film.model';
import { FilmCardComponent } from '../../../../features/films/components/film-card/film-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FilmCardComponent, RouterLink, SlicePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private filmSvc = inject(FilmService);
  films: Film[] = [];
  featuredFilm: Film | null = null;
  loading = true;

  stats = [
    { label: "Films à l'affiche", value: '24' },
    { label: 'Salles partenaires', value: '12' },
    { label: 'Clients satisfaits', value: '15k+' }
  ];

  ngOnInit(): void {
    this.filmSvc.getAll().subscribe({
      next: f => {
        this.films = f;
        this.featuredFilm = f[0] || null;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
