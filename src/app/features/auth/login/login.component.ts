import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-login',
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
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">🎓 <span>udemy<em>clone</em></span></a>
          <h1>Welcome back</h1>
          <p>Log in to continue your learning journey</p>
        </div>
        <form (ngSubmit)="onSubmit()" #f="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" placeholder="you@example.com" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <input [type]="showPwd ? 'text' : 'password'" class="form-input" placeholder="Your password" [(ngModel)]="password" name="password" required />
              <button type="button" class="pwd-toggle" (click)="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%" [disabled]="loading">
            <span *ngIf="!loading">Log In →</span>
            <span *ngIf="loading">Logging in...</span>
          </button>
        </form>
        <div class="auth-divider"><span>OR</span></div>
        <div class="auth-footer">
          Don't have an account? <a routerLink="/register">Sign up for free</a>
        </div>
        <div class="otp-link">
          Need to verify your email? <a routerLink="/verify-otp">Enter OTP</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100dvh; display: flex; align-items: center; justify-content: center;
      padding: 80px 16px 40px; position: relative; overflow: hidden;
      background: var(--gradient-hero);
    }
    .auth-bg { position: absolute; inset: 0; pointer-events: none; }
    .auth-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
    .orb-1 { width: 400px; height: 400px; background: var(--brand-purple); top: -100px; left: -100px; }
    .orb-2 { width: 300px; height: 300px; background: #5624d0; bottom: -50px; right: -50px; }
    .auth-card {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-xl); padding: 40px;
      width: 100%; max-width: 440px; position: relative; z-index: 1;
      box-shadow: var(--shadow-card);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { display: inline-flex; align-items: center; gap: 8px; font-size: 1.1rem; font-weight: 900; text-decoration: none; color: var(--text-primary); margin-bottom: 20px; }
    .auth-logo em { color: var(--brand-purple); font-style: normal; }
    .auth-header h1 { font-size: 1.6rem; margin-bottom: 8px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .input-wrapper { position: relative; }
    .input-wrapper .form-input { padding-right: 48px; }
    .pwd-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; }
    .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--text-muted); font-size: 0.8rem; }
    .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border-color); }
    .auth-footer, .otp-link { text-align: center; font-size: 0.88rem; color: var(--text-secondary); margin-top: 12px; }
    .auth-footer a, .otp-link a { color: var(--brand-purple-light); text-decoration: none; font-weight: 600; }
  `]
})
export class LoginComponent {
  email = ''; password = ''; loading = false; showPwd = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.toast.success('Welcome back!'); this.router.navigate(['/']); },
      error: (e) => { this.toast.error(e.error?.message || 'Invalid credentials'); this.loading = false; }
    });
  }
}
