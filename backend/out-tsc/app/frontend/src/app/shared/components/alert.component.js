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
exports.AlertComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
let AlertComponent = class AlertComponent {
    message = '';
    type = 'error';
};
exports.AlertComponent = AlertComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], AlertComponent.prototype, "message", void 0);
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", String)
], AlertComponent.prototype, "type", void 0);
exports.AlertComponent = AlertComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-alert',
        standalone: true,
        imports: [common_1.CommonModule],
        template: `
    <div *ngIf="message" class="alert" [ngClass]="'alert-' + type">
      {{ message }}
    </div>
  `,
        styles: [`
    .alert {
      padding: 0.8rem 1rem;
      font-size: 12px;
      margin-bottom: 1rem;
      border-left: 3px solid;
      font-family: var(--font-mono);
    }
    .alert-error   { background: rgba(192,57,43,0.1); border-color: var(--red);  color: #e74c3c; }
    .alert-success { background: rgba(46,204,113,0.1); border-color: var(--green); color: var(--green); }
    .alert-info    { background: rgba(201,168,76,0.1); border-color: var(--gold); color: var(--gold); }
  `]
    })
], AlertComponent);
//# sourceMappingURL=alert.component.js.map