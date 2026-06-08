import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container-wide">
        <div class="footer-grid">
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              <span>🎓</span>
              <span class="logo-text">udemy<span class="logo-accent">clone</span></span>
            </a>
            <p class="footer-desc">The best place to learn and teach online. Build your skills with world-class instructors.</p>
          </div>
          <div class="footer-links">
            <h4>Platform</h4>
            <a routerLink="/courses">Browse Courses</a>
            <a routerLink="/register">Become an Instructor</a>
            <a routerLink="/my-learning">My Learning</a>
          </div>
          <div class="footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 UdemyClone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 48px 0 24px;
      margin-top: auto;
    }
    .footer-grid {
      display: grid; grid-template-columns: 2fr 1fr 1fr;
      gap: 48px; margin-bottom: 40px;
    }
    .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .logo-text {
      font-family: 'Inter Tight', sans-serif; font-size: 1.1rem;
      font-weight: 900; color: var(--text-primary);
    }
    .logo-accent { color: var(--brand-purple); }
    .footer-desc { color: var(--text-muted); font-size: 0.9rem; margin-top: 12px; line-height: 1.7; }
    .footer-links h4 { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer-links a {
      display: block; color: var(--text-muted); font-size: 0.9rem;
      margin-bottom: 10px; text-decoration: none;
      transition: color var(--transition-fast);
    }
    .footer-links a:hover { color: var(--brand-purple-light); }
    .footer-bottom { border-top: 1px solid var(--border-color); padding-top: 24px; text-align: center; }
    .footer-bottom p { color: var(--text-muted); font-size: 0.85rem; }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    }
  `]
})
export class FooterComponent {}
