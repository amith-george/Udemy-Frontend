import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="instructor-container">
      <aside class="sidebar">
        <div class="sidebar-menu">
          <a routerLink="/instructor/courses" routerLinkActive="active" class="menu-item">
            <span class="icon">📺</span>
            <span class="label">Courses</span>
          </a>
          <a routerLink="/instructor/performance" routerLinkActive="active" class="menu-item">
            <span class="icon">📊</span>
            <span class="label">Performance</span>
          </a>
          <a routerLink="/instructor/categories" routerLinkActive="active" class="menu-item">
            <span class="icon">📁</span>
            <span class="label">Categories</span>
          </a>
          <a routerLink="/instructor/profile" routerLinkActive="active" class="menu-item">
            <span class="icon">⚙️</span>
            <span class="label">Profile</span>
          </a>
        </div>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .instructor-container { display: flex; min-height: calc(100vh - 72px); }
    .sidebar { width: 80px; background: var(--text-primary); color: #fff; display: flex; flex-direction: column; align-items: center; padding-top: 24px; transition: width var(--transition-fast); }
    .sidebar:hover { width: 200px; }
    .sidebar:hover .label { display: block; }
    .menu-item { display: flex; align-items: center; gap: 16px; padding: 16px; color: #d1d7dc; text-decoration: none; width: 100%; transition: background var(--transition-fast), color var(--transition-fast); }
    .menu-item:hover, .menu-item.active { background: #3e4143; color: #fff; border-left: 4px solid var(--udemy-purple); padding-left: 12px; }
    .icon { font-size: 1.5rem; text-align: center; width: 24px; }
    .label { display: none; font-size: 1rem; font-weight: 700; white-space: nowrap; }
    .content { flex: 1; padding: 48px; background: #fff; }
    @media (max-width: 900px) {
      .sidebar { width: 64px; }
      .sidebar:hover { width: 64px; }
      .sidebar:hover .label { display: none; }
      .content { padding: 24px; }
    }
  `]
})
export class InstructorLayoutComponent {}
