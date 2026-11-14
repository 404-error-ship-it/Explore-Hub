import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state" role="status">
      @if (isError()) {
        <div class="empty-icon error-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 class="empty-title">Something went wrong</h3>
        <p class="empty-message">
          We couldn't load the explorations. Please try again.
        </p>
        <button
          class="empty-action"
          (click)="retry.emit()"
          type="button"
        >
          Retry
        </button>
      } @else {
        <div class="empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M8 11h6M11 8v6" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="empty-title">No explorations found</h3>
        <p class="empty-message">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <button
          class="empty-action"
          (click)="clearFilters.emit()"
          type="button"
        >
          Clear all filters
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
      color: var(--text-secondary);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .error-icon {
      color: #ef4444;
      opacity: 0.8;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .empty-message {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0 0 20px;
      max-width: 400px;
    }

    .empty-action {
      padding: 10px 24px;
      font-size: 0.9375rem;
      font-weight: 500;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .empty-action:hover {
      opacity: 0.9;
    }

    .empty-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `],
})
export class EmptyStateComponent {
  readonly isError = input<boolean>(false);
  readonly retry = output<void>();
  readonly clearFilters = output<void>();
}
