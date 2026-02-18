import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { Film, CreateFilmRequest } from '../../core/models/film.model';

@Component({
  selector: 'app-film-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" (close)="cancel.emit()">
      <div class="form-title">{{ editMode ? 'Modifier le film' : 'Ajouter un film' }}</div>
      <div class="form-sub">{{ editMode ? 'Mettez à jour les informations' : 'Remplissez les informations' }}</div>

      <app-alert [message]="error" type="error"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Titre</label>
          <input formControlName="title" type="text" placeholder="Titre du film" />
        </div>
        <div class="field">
          <label>Genre</label>
          <input formControlName="genre" type="text" placeholder="Action, Drame, Comédie…" />
        </div>
        <div class="field">
          <label>Description</label>
          <textarea formControlName="description" rows="3"></textarea>
        </div>
        <div class="field">
          <label>Durée (min)</label>
          <input formControlName="duration" type="number" min="1" />
        </div>
        <div class="field">
          <label>Date de sortie</label>
          <input formControlName="releaseDate" type="date" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-gold" [disabled]="form.invalid || loading">
            {{ loading ? 'En cours…' : (editMode ? 'Modifier' : 'Ajouter') }}
          </button>
          <button type="button" class="btn btn-outline" (click)="cancel.emit()">Annuler</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; }
    .form-sub   { color: var(--text-dim); font-size: 11px; margin-bottom: 1.5rem; letter-spacing: 0.08em; }
    .form-actions { display: flex; gap: 0.8rem; margin-top: 1.5rem; }
    .form-actions .btn { flex: 1; justify-content: center; }
  `]
})
export class FilmFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() film: Film | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Output() save   = new EventEmitter<CreateFilmRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title:       ['', Validators.required],
      genre:       ['', Validators.required],
      description: ['', Validators.required],
      duration:    [null, [Validators.required, Validators.min(1)]],
      releaseDate: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    this.editMode = !!this.film;
    if (this.film) {
      this.form.patchValue({
        ...this.film,
        releaseDate: this.film.releaseDate.substring(0, 10)
      });
    } else {
      this.form.reset();
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.save.emit({
      ...v,
      duration: Number(v.duration),
      releaseDate: new Date(v.releaseDate).toISOString()
    });
  }
}
