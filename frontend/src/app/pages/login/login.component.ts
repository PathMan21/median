import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertComponent } from '../../shared/components/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="auth-page container animate-fade-in">
      <div class="auth-card glass">
        <div class="auth-header">
          <h1 class="font-display text-gradient">Connexion</h1>
          <p class="auth-subtitle">Ravis de vous revoir parmi nous.</p>
        </div>

        <app-alert [message]="error" type="error"></app-alert>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Identifiant</label>
            <div class="input-wrapper">
              <input formControlName="login" type="text" placeholder="Entrez votre login" autocomplete="username" class="modern-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="input-wrapper">
              <input formControlName="password" type="password" placeholder="••••••••" autocomplete="current-password" class="modern-input" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="form.invalid || loading">
            <span *ngIf="!loading">Accéder à l'expérience</span>
            <span *ngIf="loading" class="loader-dots">Extraction...</span>
          </button>
        </form>

        <div class="auth-footer">
          <span class="muted">Nouvelle recrue ?</span>
          <a routerLink="/register" class="auth-link">Créer un compte</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 12rem);
    }

    .auth-card {
      width: 100%;
      max-width: 480px;
      padding: 3rem;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--border);
    }

    .auth-header {
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modern-input {
      width: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 0.875rem 1.25rem;
      border-radius: var(--radius-lg);
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
      outline: none;
    }

    .modern-input:focus {
      border-color: var(--accent-primary);
      background: var(--bg-surface);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
    }

    .full-width { width: 100%; }

    .auth-footer {
      margin-top: 2.5rem;
      text-align: center;
      font-size: 0.875rem;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .muted { color: var(--text-muted); }
    
    .auth-link {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .auth-link:hover { color: var(--text-primary); }

    .loader-dots {
      display: inline-block;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value as any).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']); },
      error: e => { this.loading = false; const msg = e.error?.message; this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Identifiants invalides.'); }
    });
  }
}

