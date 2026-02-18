"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const auth_service_1 = require("./core/services/auth.service");
let AppComponent = class AppComponent {
    auth = (0, core_1.inject)(auth_service_1.AuthService);
};
exports.AppComponent = AppComponent;
exports.AppComponent = AppComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-root',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterOutlet, router_1.RouterLink, router_1.RouterLinkActive],
        template: `
    <header>
      <a class="logo" routerLink="/">Median <span>cinéma</span></a>

      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
        <a routerLink="/films"   routerLinkActive="active">Films</a>
        <a routerLink="/cinemas" routerLinkActive="active">Cinémas</a>
        <a routerLink="/bookings" routerLinkActive="active" *ngIf="auth.isLoggedIn()">
          {{ auth.isAdmin() ? 'Réservations' : 'Mes réservations' }}
        </a>
      </nav>

      <div class="header-right">
        <span class="user-info" *ngIf="auth.currentUser() as user">
          Bonjour, <strong>{{ user.login }}</strong>
          <span class="role-badge" *ngIf="auth.isAdmin()">admin</span>
        </span>
        <a routerLink="/login" class="btn btn-outline btn-sm" *ngIf="!auth.isLoggedIn()">Connexion</a>
        <button class="btn btn-outline btn-sm" *ngIf="auth.isLoggedIn()" (click)="auth.logout()">Déconnexion</button>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
        styles: [`
    :host { display: block; min-height: 100vh; }

    header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(10,10,11,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0 2rem;
      display: flex; align-items: center; justify-content: space-between;
      height: 56px;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 1.4rem; font-weight: 900;
      color: var(--gold); letter-spacing: 0.05em;
      text-transform: uppercase; text-decoration: none;
      white-space: nowrap;
    }
    .logo span {
      color: var(--text-dim); font-weight: 400;
      font-style: italic; font-size: 0.8rem; margin-left: 6px;
    }

    nav { display: flex; }
    nav a {
      color: var(--text-dim); font-family: var(--font-mono);
      font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
      padding: 0 1.1rem; height: 56px;
      display: flex; align-items: center;
      border-bottom: 2px solid transparent;
      text-decoration: none;
      transition: color 0.2s, border-color 0.2s;
    }
    nav a:hover, nav a.active { color: var(--gold); border-bottom-color: var(--gold); }

    .header-right { display: flex; align-items: center; gap: 1rem; }

    .user-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
    .user-info strong { color: var(--text); }

    .role-badge {
      font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 1px 6px; border: 1px solid var(--gold-dim); color: var(--gold);
    }

    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
    }

    @media (max-width: 600px) {
      header { padding: 0 1rem; }
      nav a  { padding: 0 0.6rem; font-size: 10px; }
      main   { padding: 1.5rem 1rem; }
    }
  `]
    })
], AppComponent);
//# sourceMappingURL=app.component.js.map