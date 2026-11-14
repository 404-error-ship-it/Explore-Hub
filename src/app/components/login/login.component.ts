import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo" aria-hidden="true">
            <span class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </span>
            <span class="logo-text">Explore<span class="logo-accent">Hub</span></span>
          </div>
          <h1>Welcome Back</h1>
          <p>Log in to track your progress and take exams</p>
        </div>

        @if (error()) {
          <div class="auth-error" role="alert">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              placeholder="At least 6 characters"
              required
              autocomplete="current-password"
            />
          </div>

          <button type="submit" class="auth-submit" [disabled]="loading()">
            {{ loading() ? 'Signing in…' : 'Log In' }}
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account?
          <a routerLink="/signup">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 64px);
      padding: 48px 16px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 36px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .auth-icon {
      display: inline-flex;
      color: var(--primary-color);
      margin-bottom: 12px;
    }

    .auth-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
    }

    .logo-accent {
      color: var(--primary-color);
    }

    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    .auth-header p {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .auth-error {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.875rem;
      margin-bottom: 16px;
    }

    :host-context([data-theme="dark"]) .auth-error {
      background: #7f1d1d;
      color: #fca5a5;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-group input {
      padding: 12px 14px;
      font-size: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      background: var(--surface-color);
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-group input::placeholder {
      color: var(--text-secondary);
      opacity: 0.6;
    }

    .form-group input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-color-alpha);
    }

    .auth-submit {
      padding: 14px;
      font-size: 1rem;
      font-weight: 600;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.15s;
      margin-top: 4px;
    }

    .auth-submit:hover:not(:disabled) {
      opacity: 0.9;
    }

    .auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-switch {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 20px;
    }

    .auth-switch a {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    .auth-switch a:hover {
      text-decoration: underline;
    }
  `],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly error = signal('');
  readonly loading = signal(false);

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    const result = this.auth.login(this.email, this.password);
    this.loading.set(false);

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set(result.error || 'Login failed.');
    }
  }
}
