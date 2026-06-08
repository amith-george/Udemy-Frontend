import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, RegisterDto } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-register',
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
          <h1>Create your account</h1>
          <p>Start learning from the best instructors today</p>
        </div>

        <form (ngSubmit)="onSubmit()" #f="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" placeholder="John Doe" [(ngModel)]="dto.fullName" name="fullName" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" placeholder="you@example.com" [(ngModel)]="dto.email" name="email" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <input [type]="showPwd ? 'text' : 'password'" class="form-input" placeholder="Min. 8 characters" [(ngModel)]="dto.password" name="password" required minlength="8" />
              <button type="button" class="pwd-toggle" (click)="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">I want to</label>
            <div class="role-grid">
              <div class="role-card" [class.selected]="dto.systemRole === 2" (click)="dto.systemRole = 2">
                <span class="role-icon">📚</span>
                <span class="role-label">Learn</span>
                <p class="role-desc">Access courses as a student</p>
              </div>
              <div class="role-card" [class.selected]="dto.systemRole === 1" (click)="dto.systemRole = 1">
                <span class="role-icon">🎓</span>
                <span class="role-label">Teach</span>
                <p class="role-desc">Create courses as an instructor</p>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%" [disabled]="loading || !f.valid">
            <span *ngIf="!loading">Create Account →</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Log in</a>
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
    .orb-1 { width: 400px; height: 400px; background: var(--brand-purple); top: -100px; right: -100px; }
    .orb-2 { width: 300px; height: 300px; background: #5624d0; bottom: -50px; left: -50px; }
    .auth-card {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-xl); padding: 40px;
      width: 100%; max-width: 480px;
      position: relative; z-index: 1;
      box-shadow: var(--shadow-card);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo {
      display: inline-flex; align-items: center; gap: 8px; font-size: 1.1rem;
      font-weight: 900; text-decoration: none; color: var(--text-primary); margin-bottom: 20px;
    }
    .auth-logo em { color: var(--brand-purple); font-style: normal; }
    .auth-header h1 { font-size: 1.6rem; margin-bottom: 8px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .input-wrapper { position: relative; }
    .input-wrapper .form-input { padding-right: 48px; }
    .pwd-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; }
    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .role-card {
      border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;
      cursor: pointer; text-align: center; transition: all var(--transition-smooth);
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .role-card:hover { border-color: var(--brand-purple); background: rgba(164,53,240,0.05); }
    .role-card.selected { border-color: var(--brand-purple); background: rgba(164,53,240,0.1); }
    .role-icon { font-size: 1.5rem; }
    .role-label { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
    .role-desc { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 0.88rem; color: var(--text-secondary); }
    .auth-footer a { color: var(--brand-purple-light); text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
  dto: RegisterDto = { fullName: '', email: '', password: '', systemRole: 2 };
  loading = false;
  showPwd = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.auth.register(this.dto).subscribe({
      next: () => {
        this.toast.success('Account created! Please check your email for the OTP.');
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.dto.email } });
      },
      error: (e) => { this.toast.error(e.error?.message || 'Registration failed'); this.loading = false; }
    });
  }
}
