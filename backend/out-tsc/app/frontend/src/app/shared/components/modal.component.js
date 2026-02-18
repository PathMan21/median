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
exports.ModalComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
let ModalComponent = class ModalComponent {
    isOpen = false;
    close = new core_1.EventEmitter();
    onOverlayClick(e) {
        if (e.target.classList.contains('modal-overlay')) {
            this.close.emit();
        }
    }
};
exports.ModalComponent = ModalComponent;
__decorate([
    (0, core_1.Input)(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "isOpen", void 0);
__decorate([
    (0, core_1.Output)(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "close", void 0);
exports.ModalComponent = ModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-modal',
        standalone: true,
        imports: [common_1.CommonModule],
        template: `
    <div class="modal-overlay" [class.open]="isOpen" (click)="onOverlayClick($event)">
      <div class="modal">
        <button class="modal-close" (click)="close.emit()">✕</button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
        styles: [`
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(4px);
      z-index: 200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
    .modal {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 2rem;
      width: 100%;
      max-width: 480px;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none;
      color: var(--text-dim); font-size: 18px;
      cursor: pointer; line-height: 1;
    }
    .modal-close:hover { color: var(--text); }
  `]
    })
], ModalComponent);
//# sourceMappingURL=modal.component.js.map