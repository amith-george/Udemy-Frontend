import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-page page-enter">
      <div class="success-card">
        <div class="success-animation">
          <div class="checkmark-circle">
            <div class="checkmark">✓</div>
          </div>
          <div class="confetti" *ngFor="let c of confetti" [style.left]="c.x" [style.color]="c.color" [style.animation-delay]="c.delay">🎉</div>
        </div>
        <h1>Enrollment Successful! 🎓</h1>
        <p>Your payment was processed and you're now enrolled in your courses.</p>
        <p class="sub">Start learning right away — your courses are waiting!</p>
        <div class="success-actions">
          <a routerLink="/my-learning" class="btn btn-primary btn-lg">▶ Start Learning</a>
          <a routerLink="/courses" class="btn btn-secondary">Explore More Courses</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100dvh; display: flex; align-items: center; justify-content: center;
      padding: 80px 16px; background: var(--gradient-hero);
    }
    .success-card {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-xl); padding: 60px 40px; text-align: center;
      max-width: 520px; width: 100%; box-shadow: var(--shadow-card); position: relative;
    }
    .success-animation { position: relative; display: flex; justify-content: center; margin-bottom: 32px; }
    .checkmark-circle {
      width: 96px; height: 96px; border-radius: 50%;
      background: var(--gradient-brand);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow-brand);
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .checkmark { font-size: 2.5rem; color: #fff; font-weight: 900; }
    .confetti { position: absolute; font-size: 1.2rem; animation: confettiFall 2s ease forwards; opacity: 0; }
    @keyframes confettiFall { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(80px); opacity: 0; } }
    h1 { font-size: 2rem; margin-bottom: 12px; }
    p { color: var(--text-secondary); margin-bottom: 8px; }
    .sub { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 32px; }
    .success-actions { display: flex; flex-direction: column; gap: 12px; align-items: center; }
  `]
})
export class SuccessComponent {
  confetti = [
    { x: '10%', color: '#a435f0', delay: '0s' },
    { x: '25%', color: '#f69c08', delay: '0.2s' },
    { x: '75%', color: '#22c55e', delay: '0.1s' },
    { x: '90%', color: '#3b82f6', delay: '0.3s' },
  ];
}
