import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent, AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public regexLogin = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-]{0,19}$/;
  public regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  public regexPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(5), Validators.pattern(this.regexLogin)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.pattern(this.regexMail), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPwd)]],
  });

  get emailControl() {
    return this.form.get('email');
  }

  get emailError(): string {
    const c = this.emailControl;
    if (!c || !(c.touched || c.dirty)) return '';
    if (c.hasError('required')) return "L'email est requis.";
    if (c.hasError('minlength')) return "L'email est trop court.";
    if (c.hasError('email')) return "Format d'email invalide.";
    if (c.hasError('pattern')) return "Format d'email invalide.";
    return '';
  }

  get loginControl() {
    return this.form.get('login');
  }

  get loginError(): string {
    const c = this.loginControl;
    if (!c || !(c.touched || c.dirty)) return '';
    if (c.hasError('required')) return "L'identifiant est requis.";
    if (c.hasError('minlength')) return "L'identifiant est trop court.";
    if (c.hasError('pattern')) return "Identifiant invalide (commence par une lettre, 1-20 caractères, chiffres ou . - autorisés).";
    return '';
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get passwordError(): string {
    const c = this.passwordControl;
    if (!c || !(c.touched || c.dirty)) return '';
    if (c.hasError('required')) return "Le mot de passe est requis.";
    if (c.hasError('minlength')) return "Le mot de passe est trop court (8 caractères minimum).";
    if (c.hasError('pattern')) return "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.";
    return '';
  }

  loading = false;
  error = '';
  success = '';

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
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
