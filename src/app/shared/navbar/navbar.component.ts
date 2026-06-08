import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <img src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy" class="logo-img" *ngIf="false" />
          <span class="logo-text">Udemy</span>
        </a>

        <!-- Categories link (placeholder) -->
        <a routerLink="/courses" class="nav-link categories-link">Categories</a>

        <!-- Search -->
        <div class="search-container">
          <form class="search-bar" (submit)="onSearch($event)">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Search for anything" [(ngModel)]="searchQuery" name="search" class="search-input" />
          </form>
        </div>

        <!-- Desktop Links -->
        <div class="nav-links">
          <a routerLink="/courses" class="nav-link">Udemy Business</a>
          <a *ngIf="!isInstructor" routerLink="/register" class="nav-link">Teach on Udemy</a>
          <a *ngIf="isInstructor" routerLink="/instructor" class="nav-link">Instructor</a>
          <a *ngIf="isLoggedIn" routerLink="/my-learning" class="nav-link">My learning</a>
        </div>

        <!-- Right Actions -->
        <div class="nav-actions">
          <a routerLink="/cart" class="cart-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </a>

          <ng-container *ngIf="!isLoggedIn; else loggedInTpl">
            <a routerLink="/login" class="btn btn-outline btn-sm login-btn">Log in</a>
            <a routerLink="/register" class="btn btn-primary btn-sm signup-btn">Sign up</a>
          </ng-container>

          <ng-template #loggedInTpl>
            <div class="user-menu" (mouseenter)="menuOpen = true" (mouseleave)="menuOpen = false">
              <div class="avatar">{{ userInitial }}</div>
              <div class="dropdown" *ngIf="menuOpen">
                <div class="dropdown-header">
                  <div class="avatar-lg">{{ userInitial }}</div>
                  <div>
                    <p class="dropdown-name">{{ userName }}</p>
                    <p class="dropdown-email">{{ userEmail }}</p>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a routerLink="/my-learning" class="dropdown-item">My learning</a>
                <a routerLink="/cart" class="dropdown-item">My cart</a>
                <div class="dropdown-divider" *ngIf="isInstructor"></div>
                <a *ngIf="isInstructor" routerLink="/instructor" class="dropdown-item">Instructor Dashboard</a>
                <div class="dropdown-divider"></div>
                <a routerLink="/profile" class="dropdown-item">Edit profile</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" (click)="logout()">Log out</button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--bg-white);
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      position: relative; z-index: 1000;
      height: 72px;
    }
    .navbar-inner {
      display: flex; align-items: center; gap: 12px; height: 100%;
      padding: 0 24px; max-width: 100%;
    }
    .logo { display: flex; align-items: center; text-decoration: none; padding-right: 8px; }
    .logo-text { font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
    .nav-link {
      font-size: 0.9rem; color: var(--text-primary); text-decoration: none;
      padding: 10px 12px; white-space: nowrap; transition: color var(--transition-fast);
    }
    .nav-link:hover { color: var(--udemy-purple); }
    .search-container { flex: 1; min-width: 200px; max-width: 800px; padding: 0 12px; }
    .search-bar {
      display: flex; align-items: center; gap: 12px;
      background: var(--bg-light); border: 1px solid var(--text-primary);
      border-radius: var(--radius-pill); padding: 0 16px; height: 48px;
    }
    .search-bar svg { color: var(--text-secondary); flex-shrink: 0; }
    .search-input { background: none; border: none; outline: none; width: 100%; font-family: var(--font-sans); font-size: 0.9rem; color: var(--text-primary); }
    .nav-links { display: flex; align-items: center; }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .cart-btn { position: relative; color: var(--text-primary); padding: 10px; display: flex; align-items: center; transition: color var(--transition-fast); }
    .cart-btn:hover { color: var(--udemy-purple); }
    .cart-badge { position: absolute; top: 4px; right: 0px; background: var(--udemy-purple); color: #fff; font-size: 0.75rem; font-weight: 700; border-radius: var(--radius-pill); width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
    .login-btn, .signup-btn { font-size: 0.9rem; padding: 0 16px; height: 40px; }
    .user-menu { position: relative; height: 72px; display: flex; align-items: center; padding: 0 10px; cursor: pointer; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--text-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
    .dropdown { position: absolute; top: 72px; right: 0; background: var(--bg-white); border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); width: 280px; z-index: 1000; }
    .dropdown-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
    .avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: var(--text-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
    .dropdown-name { font-weight: 700; font-size: 1rem; color: var(--text-primary); margin-bottom: 4px; }
    .dropdown-email { font-size: 0.85rem; color: var(--text-secondary); }
    .dropdown-divider { height: 1px; background: var(--border-color); }
    .dropdown-item { display: block; padding: 12px 16px; font-size: 0.95rem; color: var(--text-primary); text-decoration: none; background: none; border: none; width: 100%; text-align: left; font-family: var(--font-sans); cursor: pointer; }
    .dropdown-item:hover { color: var(--udemy-purple); }
    @media (max-width: 900px) { .nav-links, .categories-link { display: none; } }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchQuery = '';
  isLoggedIn = false;
  cartCount = 0;
  userName = '';
  userEmail = '';
  userInitial = 'U';
  menuOpen = false;
  isInstructor = false;
  private subs = new Subscription();

  constructor(private auth: AuthService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.subs.add(this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.fullName ?? '';
      this.userEmail = user?.email ?? '';
      this.userInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
      this.isInstructor = user?.systemRole === 1;
      if (user) this.cartService.loadCart().subscribe();
    }));
    this.subs.add(this.cartService.cartItems$.subscribe(items => this.cartCount = items.length));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  onSearch(e: Event): void {
    e.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/courses'], { queryParams: { q: this.searchQuery } });
    }
  }

  logout(): void { this.auth.logout(); this.menuOpen = false; }
}
