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
exports.CinemaCardComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
let CinemaCardComponent = class CinemaCardComponent {
    cinema;
    showAdmin = false;
    edit = new core_1.EventEmitter();
    delete = new core_1.EventEmitter();
};
exports.CinemaCardComponent = CinemaCardComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], CinemaCardComponent.prototype, "cinema", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], CinemaCardComponent.prototype, "showAdmin", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], CinemaCardComponent.prototype, "edit", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], CinemaCardComponent.prototype, "delete", void 0);
exports.CinemaCardComponent = CinemaCardComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-cinema-card',
        standalone: true,
        imports: [common_1.CommonModule],
        template: `
    <div class="card">
      <div class="card-genre">{{ cinema.city }}</div>
      <div class="card-title">{{ cinema.name }}</div>
      <div class="card-desc">{{ cinema.address }}</div>
      <div class="card-meta">
        <div class="meta-item"><strong>Capacité</strong>{{ cinema.capacity }} places</div>
        <div class="meta-item"><strong>Tél.</strong>{{ cinema.phone }}</div>
      </div>
      <div class="card-actions" *ngIf="showAdmin">
        <button class="btn btn-icon btn-sm" (click)="edit.emit(cinema)" title="Modifier">✎</button>
        <button class="btn btn-red btn-sm"  (click)="delete.emit(cinema)" title="Supprimer">✕</button>
      </div>
    </div>
  `,
        styles: [`
    .card {
      background: var(--surface); padding: 1.5rem;
      transition: background 0.2s; position: relative; overflow: hidden;
    }
    .card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: var(--gold); transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .card:hover { background: var(--surface2); }
    .card:hover::after { transform: scaleX(1); }
    .card-genre  { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .card-title  { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text); margin-bottom: 0.6rem; }
    .card-desc   { color: var(--text-mid); font-size: 12px; margin-bottom: 1rem; }
    .card-meta   { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .meta-item   { font-size: 10px; color: var(--text-dim); }
    .meta-item strong { color: var(--text-mid); display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
    .card-actions { display: flex; gap: 0.5rem; }
  `]
    })
], CinemaCardComponent);
//# sourceMappingURL=cinema-card.component.js.map