import { Component, OnInit, inject } from '@angular/core';
import { CinemaService } from '../../../../core/services/cinema.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CinemaCardComponent } from '../../components/cinema-card/cinema-card.component';
import { CinemaFormComponent } from '../../components/cinema-form/cinema-form.component';
import { Cinema, CreateCinemaRequest } from '../../../../core/models/cinema.model';

@Component({
  selector: 'app-cinemas-page',
  standalone: true,
  imports: [CinemaCardComponent, CinemaFormComponent],
  templateUrl: './cinemas.component.html',
  styleUrls: ['./cinemas.component.scss']
})
export class CinemasPageComponent implements OnInit {
  auth = inject(AuthService);
  private svc = inject(CinemaService);

  cinemas: Cinema[] = [];
  loading = true;
  formOpen = false;
  selectedCinema: Cinema | null = null;
  formLoading = false;
  formError = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: c => { this.cinemas = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(cinema?: Cinema): void {
    this.selectedCinema = cinema ?? null;
    this.formError = '';
    this.formOpen = true;
  }

  onSave(req: CreateCinemaRequest): void {
    this.formLoading = true;
    this.formError = '';
    const obs = this.selectedCinema
      ? this.svc.update(this.selectedCinema.id, req)
      : this.svc.create(req);

    obs.subscribe({
      next: () => { this.formLoading = false; this.formOpen = false; this.load(); },
      error: e => { this.formLoading = false; this.formError = e.error?.message || 'Erreur.'; }
    });
  }

  onDelete(cinema: Cinema): void {
    if (!confirm(`Supprimer "${cinema.name}" ?`)) return;
    this.svc.delete(cinema.id).subscribe({ next: () => this.load(), error: () => { } });
  }
}
