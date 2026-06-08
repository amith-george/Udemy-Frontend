import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="auth-page page-enter">
      <div class="auth-bg">
        <div class="auth-orb orb-1"></div>
        <div class="auth-orb orb-2"></div>
      </div>
      <div class="auth-card">
        <div class="otp-icon">📧</div>
        <div class="auth-header">
          <h1>Verify your email</h1>
          <p>We've sent a 6-digit OTP to <strong>{{ email || 'your email' }}</strong></p>
        </div>
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" placeholder="you@example.com" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label class="form-label">OTP Code</label>
            <input type="text" class="form-input otp-input" placeholder="6-digit code" [(ngModel)]="otp" name="otp" required maxlength="6" pattern="[0-9]{6}" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%" [disabled]="loading">
            <span *ngIf="!loading">Verify & Continue →</span>
            <span *ngIf="loading">Verifying...</span>
          </button>
          <button type="button" class="btn btn-ghost" style="width:100%" (click)="resendOtp()" [disabled]="resendLoading || countdown > 0">
            <span *ngIf="countdown === 0">Resend OTP</span>
            <span *ngIf="countdown > 0">Resend in {{ countdown }}s</span>
          </button>
        </form>
        <div class="auth-footer">
          Back to <a routerLink="/login">Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 80px 16px 40px; position: relative; overflow: hidden; background: var(--gradient-hero); }
    .auth-bg { position: absolute; inset: 0; pointer-events: none; }
    .auth-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
    .orb-1 { width: 400px; height: 400px; background: var(--brand-purple); top: -100px; right: -100px; }
    .orb-2 { width: 300px; height: 300px; background: #5624d0; bottom: -50px; left: -50px; }
    .auth-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 420px; position: relative; z-index: 1; box-shadow: var(--shadow-card); text-align: center; }
    .otp-icon { font-size: 3rem; margin-bottom: 16px; }
    .auth-header { margin-bottom: 28px; }
    .auth-header h1 { font-size: 1.5rem; margin-bottom: 10px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
    .otp-input { text-align: center; font-size: 1.4rem; letter-spacing: 0.3em; font-weight: 700; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 0.88rem; color: var(--text-secondary); }
    .auth-footer a { color: var(--brand-purple-light); font-weight: 600; text-decoration: none; }
  `]
})
export class OtpComponent implements OnInit {
  email = ''; otp = ''; loading = false; resendLoading = false; countdown = 0;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void { this.route.queryParams.subscribe(p => { if (p['email']) this.email = p['email']; }); }

  onSubmit(): void {
    this.loading = true;
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => { this.toast.success('Email verified! Welcome aboard 🎉'); this.router.navigate(['/']); },
      error: (e) => { this.toast.error(e.error?.message || 'Verification failed'); this.loading = false; }
    });
  }

  resendOtp(): void {
    this.resendLoading = true;
    this.auth.resendOtp(this.email).subscribe({
      next: () => { this.toast.success('New OTP sent!'); this.resendLoading = false; this.startCountdown(); },
      error: (e) => { this.toast.error(e.error?.message || 'Failed'); this.resendLoading = false; }
    });
  }

  startCountdown(): void {
    this.countdown = 60;
    const interval = setInterval(() => { this.countdown--; if (this.countdown === 0) clearInterval(interval); }, 1000);
  }
}
