import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, UserProfile } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="profile-page page-enter">
      <div class="container">
        <div class="profile-layout">
          <!-- Sidebar Nav -->
          <aside class="profile-sidebar">
            <div class="profile-avatar-large">{{ initial }}</div>
            <p class="profile-name">{{ profile?.fullName }}</p>
            <p class="profile-role">{{ profile?.systemRole === 1 ? '🎓 Instructor' : '📚 Student' }}</p>
            <nav class="profile-nav">
              <button [class.active]="activeTab === 'account'" (click)="activeTab = 'account'">Account Info</button>
              <button [class.active]="activeTab === 'security'" (click)="activeTab = 'security'">Security</button>
            </nav>
          </aside>

          <!-- Profile Content -->
          <div class="profile-content" *ngIf="profile">
            <!-- Account Info Tab -->
            <div *ngIf="activeTab === 'account'">
              <h2>Account Information</h2>
              <p class="section-desc">Update your personal details here</p>
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-label">Member Since</div>
                  <div class="info-value">{{ profile.createdAt | date:'mediumDate' }}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">Role</div>
                  <div class="info-value">{{ profile.systemRole === 1 ? 'Instructor' : 'Student' }}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">Email</div>
                  <div class="info-value">{{ profile.email }}</div>
                </div>
              </div>
              <form (ngSubmit)="updateProfile()" class="profile-form">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" [(ngModel)]="editName" name="fullName" required />
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  <span *ngIf="!saving">Save Changes</span>
                  <span *ngIf="saving">Saving...</span>
                </button>
              </form>
            </div>

            <!-- Security Tab -->
            <div *ngIf="activeTab === 'security'">
              <h2>Security</h2>
              <p class="section-desc">Manage your account security</p>
              <div class="security-card">
                <div class="security-item">
                  <div>
                    <p class="si-title">Email Address</p>
                    <p class="si-val">{{ profile.email }}</p>
                  </div>
                  <span class="badge badge-green">Verified</span>
                </div>
                <div class="security-item">
                  <div>
                    <p class="si-title">Password</p>
                    <p class="si-val">Last changed recently</p>
                  </div>
                </div>
              </div>
              <div class="danger-zone">
                <h3>Danger Zone</h3>
                <button class="btn btn-secondary" (click)="logout()">Log Out of All Devices</button>
              </div>
            </div>
          </div>
          <div class="loading-overlay" *ngIf="!profile"><div class="spinner"></div></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { padding: 80px 0 40px; min-height: 100dvh; }
    .profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; align-items: start; }
    .profile-sidebar { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 28px; text-align: center; position: sticky; top: 80px; }
    .profile-avatar-large {
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--gradient-brand);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 700; color: #fff;
      margin: 0 auto 16px;
    }
    .profile-name { font-weight: 700; font-size: 1rem; }
    .profile-role { font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; margin-bottom: 20px; }
    .profile-nav { display: flex; flex-direction: column; gap: 4px; }
    .profile-nav button {
      padding: 10px 14px; border-radius: var(--radius-md);
      border: none; background: none; text-align: left;
      font-family: 'Inter', sans-serif; font-size: 0.88rem;
      color: var(--text-secondary); cursor: pointer;
      transition: all var(--transition-fast);
    }
    .profile-nav button:hover { background: var(--bg-secondary); color: var(--text-primary); }
    .profile-nav button.active { background: rgba(164,53,240,0.1); color: var(--brand-purple-light); font-weight: 600; }
    .profile-content { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 36px; }
    .profile-content h2 { font-size: 1.4rem; margin-bottom: 6px; }
    .section-desc { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 28px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
    .info-card { background: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; }
    .info-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .info-value { font-weight: 600; font-size: 0.9rem; }
    .profile-form { display: flex; flex-direction: column; gap: 20px; max-width: 400px; }
    .security-card { border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 28px; }
    .security-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-color); }
    .security-item:last-child { border-bottom: none; }
    .si-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
    .si-val { font-size: 0.8rem; color: var(--text-muted); }
    .danger-zone h3 { font-size: 0.9rem; font-weight: 700; color: #ef4444; margin-bottom: 12px; }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  editName = '';
  activeTab = 'account';
  saving = false;

  constructor(private userService: UserService, private auth: AuthService, private toast: ToastService) {}

  get initial(): string { return this.profile?.fullName?.charAt(0)?.toUpperCase() || 'U'; }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({ next: p => { this.profile = p; this.editName = p.fullName; } });
  }

  updateProfile(): void {
    this.saving = true;
    this.userService.updateProfile(this.editName).subscribe({
      next: () => { this.toast.success('Profile updated!'); this.profile!.fullName = this.editName; this.saving = false; },
      error: () => { this.toast.error('Update failed'); this.saving = false; }
    });
  }

  logout(): void { this.auth.logout(); }
}
