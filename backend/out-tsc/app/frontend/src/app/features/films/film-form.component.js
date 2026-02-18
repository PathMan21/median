"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmFormComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const alert_component_1 = require("../../shared/components/alert.component");
const modal_component_1 = require("../../shared/components/modal.component");
let FilmFormComponent = class FilmFormComponent {
    fb;
    isOpen = false;
    film = null;
    loading = false;
    error = '';
    save = new core_1.EventEmitter();
    cancel = new core_1.EventEmitter();
    form;
    editMode = false;
    constructor(fb) {
        this.fb = fb;
        this.form = this.fb.group({
            title: ['', forms_1.Validators.required],
            genre: ['', forms_1.Validators.required],
            description: ['', forms_1.Validators.required],
            duration: [null, [forms_1.Validators.required, forms_1.Validators.min(1)]],
            releaseDate: ['', forms_1.Validators.required],
        });
    }
    ngOnChanges() {
        this.editMode = !!this.film;
        if (this.film) {
            this.form.patchValue({
                ...this.film,
                releaseDate: this.film.releaseDate.substring(0, 10)
            });
        }
        else {
            this.form.reset();
        }
    }
    submit() {
        if (this.form.invalid)
            return;
        const v = this.form.value;
        this.save.emit({
            ...v,
            duration: Number(v.duration),
            releaseDate: new Date(v.releaseDate).toISOString()
        });
    }
};
exports.FilmFormComponent = FilmFormComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "isOpen", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "film", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "loading", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "error", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "save", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], FilmFormComponent.prototype, "cancel", void 0);
exports.FilmFormComponent = FilmFormComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-film-form',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, alert_component_1.AlertComponent, modal_component_1.ModalComponent],
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
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], FilmFormComponent);
//# sourceMappingURL=film-form.component.js.map