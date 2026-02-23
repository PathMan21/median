import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <!-- Floating Glass Navbar -->
      <nav class="navbar-wrapper">
        <div class="navbar glass">
          <a class="logo font-display text-gradient" routerLink="/">MEDIAN</a>

          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
            <a routerLink="/films" routerLinkActive="active">Films</a>
            <a routerLink="/cinemas" routerLinkActive="active">Cinémas</a>
            <a routerLink="/bookings" routerLinkActive="active" *ngIf="auth.isLoggedIn()">
              {{ auth.isAdmin() ? 'Gestion' : 'Réservations' }}
            </a>
          </div>

          <div class="nav-actions">
            <ng-container *ngIf="auth.currentUser() as user">
              <span class="user-greeting hidden-mobile">
                <span class="user-name">{{ user.login }}</span>
                <span class="badge" *ngIf="auth.isAdmin()">Admin</span>
              </span>
              <button class="btn btn-outline btn-sm" (click)="auth.logout()">
                Quitter
              </button>
            </ng-container>
            
            <a routerLink="/login" class="btn btn-primary btn-sm" *ngIf="!auth.isLoggedIn()">
              Connexion
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="content-area animate-fade-in">
        <router-outlet></router-outlet>
      </main>

      <!-- Minimal Footer -->
      <footer class="footer container">
        <p>&copy; 2026 MEDIAN. Created for the future of Cinema.</p>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; overflow-x: hidden; }

    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar-wrapper {
      position: fixed;
      top: 1.5rem;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      justify-content: center;
      padding: 0 1rem;
    }

    .navbar {
      width: 100%;
      max-width: 1200px;
      height: 4rem;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5rem;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      background: var(--bg-glass-heavy);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.1em;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.3s ease;
      position: relative;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--text-primary);
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-primary);
      transition: width 0.3s ease;
    }

    .nav-links a:hover::after, .nav-links a.active::after {
      width: 100%;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-greeting {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }

    .user-name {
      color: var(--text-primary);
      font-weight: 600;
    }

    .badge {
      background: rgba(225, 29, 72, 0.08);
      color: var(--accent-primary);
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      border: 1px solid rgba(225, 29, 72, 0.15);
      font-weight: 700;
    }

    .content-area {
      flex: 1;
      padding-top: 8rem;
      padding-bottom: 4rem;
    }

    .footer {
      padding: 4rem 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
      border-top: 1px solid var(--border);
    }

    @media (max-width: 768px) {
      .navbar { padding: 0 1.25rem; }
      .nav-links { display: none; }
      .hidden-mobile { display: none; }
      .logo { font-size: 1.25rem; }
    }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
}

