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
exports.FilmCardComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
let FilmCardComponent = class FilmCardComponent {
    film;
    showActions = false;
    showAdmin = false;
    book = new core_1.EventEmitter();
    edit = new core_1.EventEmitter();
    delete = new core_1.EventEmitter();
};
exports.FilmCardComponent = FilmCardComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "film", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "showActions", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "showAdmin", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "book", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "edit", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], FilmCardComponent.prototype, "delete", void 0);
exports.FilmCardComponent = FilmCardComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-film-card',
        standalone: true,
        imports: [common_1.CommonModule],
        template: `
    <div class="card">
      <div class="card-genre">{{ film.genre }}</div>
      <div class="card-title">{{ film.title }}</div>
      <div class="card-desc">{{ film.description | slice:0:110 }}{{ film.description.length > 110 ? '…' : '' }}</div>
      <div class="card-meta">
        <div class="meta-item">
          <strong>Durée</strong>{{ film.duration }} min
        </div>
        <div class="meta-item">
          <strong>Sortie</strong>{{ film.releaseDate | date:'MMM y':'':'fr-FR' }}
        </div>
      </div>
      <div class="card-actions" *ngIf="showActions">
        <button class="btn btn-outline btn-sm" (click)="book.emit(film)">Réserver</button>
        <button class="btn btn-icon btn-sm" *ngIf="showAdmin" (click)="edit.emit(film)" title="Modifier">✎</button>
        <button class="btn btn-red btn-sm"   *ngIf="showAdmin" (click)="delete.emit(film)" title="Supprimer">✕</button>
      </div>
    </div>
  `,
        styles: [`
    .card {
      background: var(--surface);
      padding: 1.5rem;
      transition: background 0.2s;
      position: relative;
      overflow: hidden;
    }
    .card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: var(--gold); transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .card:hover { background: var(--surface2); }
    .card:hover::after { transform: scaleX(1); }
    .card-genre {
      font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 0.5rem;
    }
    .card-title {
      font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;
      color: var(--text); margin-bottom: 0.6rem; line-height: 1.25;
    }
    .card-desc { color: var(--text-mid); font-size: 12px; line-height: 1.6; margin-bottom: 1rem; }
    .card-meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .meta-item { font-size: 10px; color: var(--text-dim); }
    .meta-item strong { color: var(--text-mid); display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
    .card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  `]
    })
], FilmCardComponent);
//# sourceMappingURL=film-card.component.js.map