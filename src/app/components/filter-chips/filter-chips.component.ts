import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

export interface FilterChip {
  readonly type: string;
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (chips().length > 0) {
      <div class="filter-chips" role="list" aria-label="Active filters">
        @for (chip of chips(); track chip.type + chip.value) {
          <button
            class="chip"
            role="listitem"
            (click)="removeChip.emit(chip)"
            [attr.aria-label]="'Remove filter: ' + chip.label + ' ' + chip.value"
            type="button"
          >
            <span class="chip-label">{{ chip.label }}:</span>
            <span class="chip-value">{{ chip.value }}</span>
            <svg class="chip-close" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        }
        @if (chips().length > 1) {
          <button
            class="chip chip-clear-all"
            (click)="clearAll.emit()"
            type="button"
          >
            Clear all
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      font-size: 0.8125rem;
      background: var(--primary-color-alpha);
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.15s, opacity 0.15s;
      white-space: nowrap;
    }

    .chip:hover {
      opacity: 0.8;
    }

    .chip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .chip-label {
      font-weight: 600;
    }

    .chip-close {
      width: 14px;
      height: 14px;
      margin-left: 2px;
    }

    .chip-clear-all {
      background: var(--bg-muted);
      color: var(--text-secondary);
      border-color: var(--border-color);
    }

    .chip-clear-all:hover {
      background: var(--border-color);
    }
  `],
})
export class FilterChipsComponent {
  readonly chips = input<readonly FilterChip[]>([]);
  readonly removeChip = output<FilterChip>();
  readonly clearAll = output<void>();
}
