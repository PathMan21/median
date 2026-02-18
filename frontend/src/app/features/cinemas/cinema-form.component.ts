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
      <div class="form-title">{{ editMode ? 'Modifier le cinéma' : 'Ajouter un cinéma' }}</div>
      <div class="form-sub">Remplissez les informations</div>

      <app-alert [message]="error" type="error"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field"><label>Nom</label><input formControlName="name" type="text" /></div>
        <div class="field"><label>Adresse</label><input formControlName="address" type="text" /></div>
        <div class="field"><label>Ville</label><input formControlName="city" type="text" /></div>
        <div class="field"><label>Téléphone</label><input formControlName="phone" type="text" /></div>
        <div class="field"><label>Capacité</label><input formControlName="capacity" type="number" min="1" /></div>
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
export class CinemaFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() cinema: Cinema | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Output() save   = new EventEmitter<CreateCinemaRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      address:  ['', Validators.required],
      city:     ['', Validators.required],
      phone:    ['', Validators.required],
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
