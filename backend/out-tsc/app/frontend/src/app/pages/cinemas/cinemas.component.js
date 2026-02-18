"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemasPageComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const cinema_service_1 = require("../../core/services/cinema.service");
const auth_service_1 = require("../../core/services/auth.service");
const cinema_card_component_1 = require("../../features/cinemas/cinema-card.component");
const cinema_form_component_1 = require("../../features/cinemas/cinema-form.component");
let CinemasPageComponent = class CinemasPageComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
    svc = (0, core_1.inject)(cinema_service_1.CinemaService);
    cinemas = [];
    loading = true;
    formOpen = false;
    selectedCinema = null;
    formLoading = false;
    formError = '';
    ngOnInit() { this.load(); }
    load() {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: c => { this.cinemas = c; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    openForm(cinema) {
        this.selectedCinema = cinema ?? null;
        this.formError = '';
        this.formOpen = true;
    }
    onSave(req) {
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
    onDelete(cinema) {
        if (!confirm(`Supprimer "${cinema.name}" ?`))
            return;
        this.svc.delete(cinema.id).subscribe({ next: () => this.load(), error: () => { } });
    }
};
exports.CinemasPageComponent = CinemasPageComponent;
exports.CinemasPageComponent = CinemasPageComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-cinemas-page',
        standalone: true,
        imports: [common_1.CommonModule, cinema_card_component_1.CinemaCardComponent, cinema_form_component_1.CinemaFormComponent],
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
], CinemasPageComponent);
//# sourceMappingURL=cinemas.component.js.map