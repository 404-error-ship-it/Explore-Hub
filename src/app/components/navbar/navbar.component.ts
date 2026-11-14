import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-brand" aria-label="ExploreHub home">
          <span class="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          <span class="brand-text">Explore<span class="brand-accent">Hub</span></span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
            Learn
          </a>
          <a routerLink="/games" routerLinkActive="active" class="nav-link">
            Games
          </a>
          @if (isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              Dashboard
            </a>
          }
        </div>

        <div class="nav-actions">
          @if (isAuthenticated()) {
            <div class="user-menu">
              <span class="user-avatar" aria-hidden="true">{{ user()?.avatar }}</span>
              <span class="user-name">{{ user()?.name }}</span>
              <button class="logout-btn" (click)="logout()" type="button" aria-label="Log out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="auth-btn signin-btn">Sign In</a>
            <a routerLink="/signup" class="auth-btn get-started-btn">Get Started</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 3px var(--shadow-color);
    }

    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--text-primary);
      flex-shrink: 0;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--primary-color);
      color: white;
      border-radius: 10px;
    }

    .brand-accent {
      color: var(--primary-color);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      padding: 8px 16px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      transition: color 0.15s, background-color 0.15s;
    }

    .nav-link:hover {
      color: var(--primary-color);
      background: var(--primary-color-alpha);
    }

    .nav-link.active {
      color: var(--primary-color);
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .auth-btn {
      padding: 9px 20px;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 24px;
      text-decoration: none;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .signin-btn {
      color: var(--primary-color);
      background: transparent;
      border: 1.5px solid var(--primary-color);
    }

    .signin-btn:hover {
      background: var(--primary-color-alpha);
    }

    .get-started-btn {
      color: white;
      background: var(--primary-color);
      border: 1.5px solid var(--primary-color);
    }

    .get-started-btn:hover {
      background: var(--primary-color-hover);
      border-color: var(--primary-color-hover);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 1rem;
      font-weight: 700;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      background: var(--surface-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .logout-btn:hover {
      color: var(--error-color);
      border-color: var(--error-color);
      background: var(--error-bg);
    }

    @media (max-width: 768px) {
      .navbar-inner { padding: 0 12px; gap: 12px; }
      .user-name { display: none; }
      .nav-link { padding: 8px 10px; font-size: 0.8125rem; }
      .signin-btn { display: none; }
    }
  `],
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly user = this.auth.currentUser;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
