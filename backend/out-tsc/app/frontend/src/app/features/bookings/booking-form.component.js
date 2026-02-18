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
exports.BookingFormComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const alert_component_1 = require("../../shared/components/alert.component");
const modal_component_1 = require("../../shared/components/modal.component");
let BookingFormComponent = class BookingFormComponent {
    fb;
    isOpen = false;
    films = [];
    cinemas = [];
    preselectedFilmId = null;
    userId;
    loading = false;
    error = '';
    save = new core_1.EventEmitter();
    cancel = new core_1.EventEmitter();
    form;
    constructor(fb) {
        this.fb = fb;
        this.form = this.fb.group({
            filmId: ['', forms_1.Validators.required],
            cinemaId: ['', forms_1.Validators.required],
            bookingDate: ['', forms_1.Validators.required],
            numberOfSeats: [1, [forms_1.Validators.required, forms_1.Validators.min(1)]],
            totalPrice: [null, [forms_1.Validators.required, forms_1.Validators.min(0)]],
        });
    }
    ngOnChanges() {
        if (this.preselectedFilmId) {
            this.form.patchValue({ filmId: this.preselectedFilmId });
        }
        if (!this.isOpen)
            this.form.reset({ numberOfSeats: 1 });
    }
    submit() {
        if (this.form.invalid)
            return;
        const v = this.form.value;
        this.save.emit({
            userId: this.userId,
            filmId: Number(v.filmId),
            cinemaId: Number(v.cinemaId),
            bookingDate: new Date(v.bookingDate).toISOString(),
            numberOfSeats: Number(v.numberOfSeats),
            totalPrice: Number(v.totalPrice),
        });
    }
};
exports.BookingFormComponent = BookingFormComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "isOpen", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Array)
], BookingFormComponent.prototype, "films", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Array)
], BookingFormComponent.prototype, "cinemas", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "preselectedFilmId", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Number)
], BookingFormComponent.prototype, "userId", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "loading", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "error", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "save", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], BookingFormComponent.prototype, "cancel", void 0);
exports.BookingFormComponent = BookingFormComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-booking-form',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, alert_component_1.AlertComponent, modal_component_1.ModalComponent],
        template: `
    <app-modal [isOpen]="isOpen" (close)="cancel.emit()">
      <div class="form-title">Nouvelle réservation</div>
      <div class="form-sub">Remplissez les informations de séance</div>

      <app-alert [message]="error" type="error"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Film</label>
          <select formControlName="filmId">
            <option value="">— Sélectionner un film —</option>
            <option *ngFor="let f of films" [value]="f.id">{{ f.title }}</option>
          </select>
        </div>
        <div class="field">
          <label>Cinéma</label>
          <select formControlName="cinemaId">
            <option value="">— Sélectionner un cinéma —</option>
            <option *ngFor="let c of cinemas" [value]="c.id">{{ c.name }} ({{ c.city }})</option>
          </select>
        </div>
        <div class="field">
          <label>Date de séance</label>
          <input formControlName="bookingDate" type="datetime-local" />
        </div>
        <div class="field">
          <label>Nombre de sièges</label>
          <input formControlName="numberOfSeats" type="number" min="1" max="20" />
        </div>
        <div class="field">
          <label>Prix total (€)</label>
          <input formControlName="totalPrice" type="number" step="0.01" min="0" placeholder="ex: 25.00" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-gold" [disabled]="form.invalid || loading">
            {{ loading ? 'En cours…' : 'Réserver' }}
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
], BookingFormComponent);
//# sourceMappingURL=booking-form.component.js.map