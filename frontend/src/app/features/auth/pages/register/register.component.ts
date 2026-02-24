import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent, AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';
  success = '';

  submit(): void {
    if (this.form.invalid) return;
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
