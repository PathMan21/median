"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const auth_service_1 = require("../../core/services/auth.service");
const alert_component_1 = require("../../shared/components/alert.component");
let LoginComponent = class LoginComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
    router = (0, core_1.inject)(router_1.Router);
    fb = (0, core_1.inject)(forms_1.FormBuilder);
    form = this.fb.group({
        login: ['', forms_1.Validators.required],
        password: ['', forms_1.Validators.required],
    });
    loading = false;
    error = '';
    submit() {
        if (this.form.invalid)
            return;
        this.loading = true;
        this.error = '';
        this.auth.login(this.form.value).subscribe({
            next: () => { this.loading = false; this.router.navigate(['/']); },
            error: e => { this.loading = false; this.error = e.error?.message || 'Identifiants invalides.'; }
        });
    }
};
exports.LoginComponent = LoginComponent;
exports.LoginComponent = LoginComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-login',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink, alert_component_1.AlertComponent],
        template: `
    <div class="form-box">
      <div class="form-title">Connexion</div>
      <div class="form-sub">Entrez vos identifiants</div>

      <app-alert [message]="error" type="error"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Login</label>
          <input formControlName="login" type="text" placeholder="votre login" autocomplete="username" />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input formControlName="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </div>
        <button type="submit" class="btn btn-gold full" [disabled]="form.invalid || loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <div class="divider"></div>
      <p class="form-sub">Pas encore de compte ?</p>
      <a routerLink="/register" class="btn btn-outline full">Créer un compte</a>
    </div>
  `,
        styles: [`
    .form-box  { background: var(--surface); border: 1px solid var(--border); padding: 2rem; max-width: 420px; }
    .form-title{ font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; }
    .form-sub  { color: var(--text-dim); font-size: 11px; margin-bottom: 1.5rem; letter-spacing: 0.08em; }
    .divider   { height: 1px; background: var(--border); margin: 1.5rem 0; }
    .full      { width: 100%; justify-content: center; text-align: center; }
    a.btn      { display: flex; text-decoration: none; }
  `]
    })
], LoginComponent);
//# sourceMappingURL=login.component.js.map