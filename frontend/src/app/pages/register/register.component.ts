import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertComponent } from '../../shared/components/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="form-box">
      <div class="form-title">Inscription</div>
      <div class="form-sub">Créez votre compte</div>

      <app-alert [message]="error" type="error"></app-alert>
      <app-alert [message]="success" type="success"></app-alert>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Login</label>
          <input formControlName="login" type="text" placeholder="choisissez un login" autocomplete="username" />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input formControlName="password" type="password" placeholder="••••••••" autocomplete="new-password" />
        </div>
        <button type="submit" class="btn btn-gold full" [disabled]="form.invalid || loading">
          {{ loading ? 'Création…' : 'Créer le compte' }}
        </button>
      </form>

      <div class="divider"></div>
      <a routerLink="/login" class="btn btn-outline full">Déjà un compte ? Se connecter</a>
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
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    login:    ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error   = '';
  success = '';

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';
    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Compte créé ! Redirection…';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: e => { this.loading = false; const msg = e.error?.message; this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erreur lors de la création.'); }
    });
  }
}
