import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.status = 'error';
      this.message = 'Token manquant.';
      return;
    }

    this.http.get<{ message: string }>(`${environment.apiUrl}/account/verify/${token}`)
      .subscribe({
        next: (res) => {
          this.status = 'success';
          this.message = res.message;
        },
        error: (e) => {
          this.status = 'error';
          this.message = e.error?.message || 'Token invalide ou expiré.';
        }
      });
  }
}