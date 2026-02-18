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
exports.BadgeComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
let BadgeComponent = class BadgeComponent {
    status = 'PENDING';
    get label() {
        const map = {
            PENDING: 'En attente',
            CONFIRMED: 'Confirmé',
            CANCELLED: 'Annulé',
            COMPLETED: 'Terminé'
        };
        return map[this.status];
    }
};
exports.BadgeComponent = BadgeComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", String)
], BadgeComponent.prototype, "status", void 0);
exports.BadgeComponent = BadgeComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-badge',
        standalone: true,
        imports: [common_1.CommonModule],
        template: `
    <span class="badge" [ngClass]="'badge-' + status.toLowerCase()">
      {{ label }}
    </span>
  `,
        styles: [`
    .badge {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 8px;
      border: 1px solid;
      font-family: var(--font-mono);
    }
    .badge-pending   { border-color: var(--gold-dim); color: var(--gold); }
    .badge-confirmed { border-color: #27ae60; color: var(--green); }
    .badge-cancelled { border-color: #922b21; color: var(--red); }
    .badge-completed { border-color: #555; color: var(--text-dim); }
  `]
    })
], BadgeComponent);
//# sourceMappingURL=badge.component.js.map