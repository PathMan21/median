import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { Cinema, CreateCinemaRequest } from '../../core/models/cinema.model';

@Component({
  selector: 'app-cinema-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" (close)="cancel.emit()">
      <div class="cinema-form-v2">
        <header class="form-header">
          <h2 class="font-display text-gradient">{{ editMode ? 'Éditer l\\'Établissement' : 'Nouvel Établissement' }}</h2>
          <p class="muted">{{ editMode ? 'Mettez à jour les coordonnées de votre salle.' : 'Enregistrez un nouvel espace de projection d\\'exception.' }}</p>
        </header>

        <app-alert [message]="error" type="error"></app-alert>

        <form [formGroup]="form" (ngSubmit)="submit()" class="modern-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Nom du Cinéma</label>
              <input formControlName="name" type="text" placeholder="Ex: Grand Palais Lumière" class="modern-input" />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Adresse Complète</label>
              <input formControlName="address" type="text" placeholder="Rue, avenue..." class="modern-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Ville</label>
              <input formControlName="city" type="text" placeholder="Ex: Paris" class="modern-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input formControlName="phone" type="text" placeholder="+33..." class="modern-input" />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Capacité d\\'Accueil (sièges)</label>
              <input formControlName="capacity" type="number" min="1" placeholder="Ex: 250" class="modern-input" />
            </div>
          </div>

          <div class="form-footer">
            <button type="button" class="btn btn-outline" (click)="cancel.emit()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
              <span *ngIf="!loading">{{ editMode ? 'Mettre à jour' : 'Enregistrer' }}</span>
              <span *ngIf="loading" class="loader-dots">Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
    </app-modal>
  `,
  styles: [`
    .cinema-form-v2 {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-header { margin-bottom: 1rem; }
    .muted { color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem; }

    .modern-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .full-width { grid-column: span 2; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modern-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 0.875rem 1rem;
      border-radius: var(--radius-lg);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .modern-input:focus {
      border-color: var(--accent-primary);
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
    }

    .form-footer {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .form-footer button { flex: 1; justify-content: center; }

    .loader-dots { animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    @media (max-width: 480px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: auto; }
    }
  `]
})
export class CinemaFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() cinema: Cinema | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Output() save = new EventEmitter<CreateCinemaRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnChanges(): void {
    this.editMode = !!this.cinema;
    if (this.cinema) this.form.patchValue(this.cinema);
    else this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.save.emit({ ...v, capacity: Number(v.capacity) });
  }
}

