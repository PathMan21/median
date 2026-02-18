import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CinemaService } from '../../core/services/cinema.service';
import { AuthService } from '../../core/services/auth.service';
import { CinemaCardComponent } from '../../features/cinemas/cinema-card.component';
import { CinemaFormComponent } from '../../features/cinemas/cinema-form.component';
import { Cinema, CreateCinemaRequest } from '../../core/models/cinema.model';

@Component({
  selector: 'app-cinemas-page',
  standalone: true,
  imports: [CommonModule, CinemaCardComponent, CinemaFormComponent],
  template: `
    <div class="top-bar">
      <div>
        <div class="section-title">Cinémas</div>
        <div class="section-sub">Tous les établissements</div>
      </div>
      <button class="btn btn-gold btn-sm" *ngIf="auth.isAdmin()" (click)="openForm()">+ Ajouter</button>
    </div>

    <div *ngIf="loading" class="loading">Chargement</div>
    <div *ngIf="!loading && cinemas.length === 0" class="empty">
      <div class="empty-icon">🎭</div>
      Aucun cinéma enregistré
    </div>

    <div class="grid" *ngIf="!loading && cinemas.length > 0">
      <app-cinema-card
        *ngFor="let c of cinemas"
        [cinema]="c"
        [showAdmin]="auth.isAdmin()"
        (edit)="openForm($event)"
        (delete)="onDelete($event)"
      ></app-cinema-card>
    </div>

    <app-cinema-form
      [isOpen]="formOpen"
      [cinema]="selectedCinema"
      [loading]="formLoading"
      [error]="formError"
      (save)="onSave($event)"
      (cancel)="formOpen = false"
    ></app-cinema-form>
  `,
  styles: [`.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }`]
})
export class CinemasPageComponent implements OnInit {
  auth = inject(AuthService);
  private svc = inject(CinemaService);

  cinemas: Cinema[] = [];
  loading = true;
  formOpen     = false;
  selectedCinema: Cinema | null = null;
  formLoading  = false;
  formError    = '';

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
    this.formError      = '';
    this.formOpen       = true;
  }

  onSave(req: CreateCinemaRequest): void {
    this.formLoading = true;
    this.formError   = '';
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
    this.svc.delete(cinema.id).subscribe({ next: () => this.load(), error: () => {} });
  }
}
