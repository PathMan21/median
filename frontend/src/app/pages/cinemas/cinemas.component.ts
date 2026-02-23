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
    <div class="cinemas-page container animate-fade-in">
      <header class="page-header">
        <div class="header-main">
          <h1 class="font-display text-gradient">Nos Établissements</h1>
          <p class="muted">Des lieux d'exception pour des moments inoubliables.</p>
        </div>
        
        <div class="header-actions" *ngIf="auth.isAdmin()">
          <button class="btn btn-primary" (click)="openForm()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Ajouter un Cinéma
          </button>
        </div>
      </header>

      <!-- Modern Loader -->
      <div *ngIf="loading" class="modern-loader">
        <div class="loader-pulse shadow-neon"></div>
        <p>Localisation des salles...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && cinemas.length === 0" class="empty-state glass">
        <div class="empty-icon shadow-neon">🎭</div>
        <h3>Aucun établissement</h3>
        <p class="muted">Nous n'avons pas encore de salles partenaires.</p>
      </div>

      <!-- Cinema Grid -->
      <div class="cinemas-grid" *ngIf="!loading && cinemas.length > 0">
        <app-cinema-card
          *ngFor="let c of cinemas"
          [cinema]="c"
          [showAdmin]="auth.isAdmin()"
          (edit)="openForm($event)"
          (delete)="onDelete($event)"
        ></app-cinema-card>
      </div>

      <!-- Cinema Management Modal -->
      <app-cinema-form
        [isOpen]="formOpen"
        [cinema]="selectedCinema"
        [loading]="formLoading"
        [error]="formError"
        (save)="onSave($event)"
        (cancel)="formOpen = false"
      ></app-cinema-form>
    </div>
  `,
  styles: [`
    .cinemas-page {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .muted { color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem; }

    .cinemas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2.5rem;
    }

    .empty-state {
      padding: 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface);
      border-radius: 50%;
      margin-bottom: 1rem;
      box-shadow: var(--shadow-soft);
    }

    .modern-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 6rem;
      color: var(--text-muted);
    }

    .loader-pulse {
      width: 60px;
      height: 60px;
      background: var(--accent-primary);
      border-radius: 50%;
      animation: pulse 1.5s infinite ease-in-out;
      box-shadow: var(--shadow-neon);
    }

    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
    }
  `]
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

