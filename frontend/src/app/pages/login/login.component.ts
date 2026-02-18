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
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    login:    ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error   = '';

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';
    this.auth.login(this.form.value as any).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']); },
      error: e => { this.loading = false; const msg = e.error?.message; this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Identifiants invalides.'); }
    });
  }
}
