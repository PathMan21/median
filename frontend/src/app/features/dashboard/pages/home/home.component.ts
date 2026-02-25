import { Component, OnInit, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilmService } from '../../../../core/services/film.service';
import { Film } from '../../../../core/models/film.model';
import { FilmCardComponent } from '../../../../features/films/components/film-card/film-card.component';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { FilmModalService } from '../../../../core/services/film-modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FilmCardComponent, RouterLink, SlicePipe, DurationPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private filmSvc = inject(FilmService);
  modalSvc = inject(FilmModalService);
  films: Film[] = [];
  selectedIndex = 0;
  autoPlayInterval: any;
  loading = true;


  ngOnInit(): void {
    this.filmSvc.getAll().subscribe({
      next: f => {
        this.films = f;
        this.loading = false;
        this.startAutoPlay();
      },
      error: () => { this.loading = false; }
    });
  }

  get currentFilm(): Film | null {
    return this.films.length > 0 ? this.films[this.selectedIndex] : null;
  }

  selectFilm(index: number): void {
    this.selectedIndex = index;
    this.resetAutoPlay();
  }

  prevFilm(): void {
    if (this.films.length === 0) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.films.length) % this.films.length;
    this.resetAutoPlay();
  }

  nextFilm(): void {
    if (this.films.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.films.length;
    this.resetAutoPlay();
  }

  getRelativePosition(index: number): number {
    const total = this.films.length;
    if (total === 0) return 0;

    let diff = index - this.selectedIndex;

    // Handle circular wrap-around to find the shortest distance
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff;
  }

  private startX = 0;
  private isDragging = false;

  onDragStart(event: MouseEvent): void {
    this.startX = event.clientX;
    this.isDragging = true;
  }

  onDragMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const diff = event.clientX - this.startX;
    if (Math.abs(diff) > 100) { // Threshold for skip
      if (diff > 0) this.prevFilm();
      else this.nextFilm();

      this.isDragging = false; // Reset to avoid multiple skips
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextFilm();
    }, 5000);
  }

  private resetAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
