import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { FacetCount } from '../../models/exploration.model';

@Component({
  selector: 'app-filter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="filter-panel" role="complementary" aria-label="Filter explorations">
      <div class="filter-panel-header">
        <h2>Filters</h2>
        @if (hasActiveFilters()) {
          <button
            class="clear-all-btn"
            (click)="clearAll.emit()"
            type="button"
          >
            Clear all
          </button>
        }
      </div>

      <fieldset class="filter-group">
        <legend>Subject</legend>
        @for (facet of subjectCounts(); track facet.value) {
          <label class="filter-option" [class.disabled]="facet.count === 0">
            <input
              type="checkbox"
              [checked]="isSelected('subjects', facet.value)"
              (change)="toggleFilter('subjects', facet.value)"
              [attr.aria-label]="facet.value + ' (' + facet.count + ' explorations)'"
            />
            <span class="filter-label">{{ facet.value }}</span>
            <span class="filter-count" aria-hidden="true">{{ facet.count }}</span>
          </label>
        }
      </fieldset>

      <fieldset class="filter-group">
        <legend>Difficulty</legend>
        @for (facet of difficultyCounts(); track facet.value) {
          <label class="filter-option" [class.disabled]="facet.count === 0">
            <input
              type="checkbox"
              [checked]="isSelected('difficulties', facet.value)"
              (change)="toggleFilter('difficulties', facet.value)"
              [attr.aria-label]="facet.value + ' (' + facet.count + ' explorations)'"
            />
            <span class="filter-label">{{ facet.value }}</span>
            <span class="filter-count" aria-hidden="true">{{ facet.count }}</span>
          </label>
        }
      </fieldset>

      <fieldset class="filter-group">
        <legend>Language</legend>
        @for (facet of languageCounts(); track facet.value) {
          <label class="filter-option" [class.disabled]="facet.count === 0">
            <input
              type="checkbox"
              [checked]="isSelected('languages', facet.value)"
              (change)="toggleFilter('languages', facet.value)"
              [attr.aria-label]="facet.value + ' (' + facet.count + ' explorations)'"
            />
            <span class="filter-label">{{ facet.value }}</span>
            <span class="filter-count" aria-hidden="true">{{ facet.count }}</span>
          </label>
        }
      </fieldset>
    </aside>
  `,
  styles: [`
    .filter-panel {
      background: var(--surface-color);
      border-radius: 16px;
      padding: 20px;
      border: 1px solid var(--border-color);
    }

    .filter-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .filter-panel-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .clear-all-btn {
      font-size: 0.8125rem;
      color: var(--primary-color);
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .clear-all-btn:hover {
      background: var(--primary-color-alpha);
    }

    .clear-all-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .filter-group {
      border: none;
      padding: 0;
      margin: 0 0 20px;
    }

    .filter-group:last-child {
      margin-bottom: 0;
    }

    .filter-group legend {
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 8px;
      padding: 0;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.15s;
    }

    .filter-option:hover {
      background: var(--bg-muted);
    }

    .filter-option.disabled {
      opacity: 0.5;
    }

    .filter-option input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-color);
      cursor: pointer;
      flex-shrink: 0;
    }

    .filter-option input[type="checkbox"]:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .filter-label {
      flex: 1;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .filter-count {
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: var(--bg-muted);
      padding: 2px 8px;
      border-radius: 10px;
      min-width: 24px;
      text-align: center;
    }
  `],
})
export class FilterPanelComponent {
  readonly selectedSubjects = input<readonly string[]>([]);
  readonly selectedDifficulties = input<readonly string[]>([]);
  readonly selectedLanguages = input<readonly string[]>([]);
  readonly subjectCounts = input<readonly FacetCount[]>([]);
  readonly difficultyCounts = input<readonly FacetCount[]>([]);
  readonly languageCounts = input<readonly FacetCount[]>([]);

  readonly filterChange = output<{ type: string; value: string }>();
  readonly clearAll = output<void>();

  hasActiveFilters(): boolean {
    return (
      this.selectedSubjects().length > 0 ||
      this.selectedDifficulties().length > 0 ||
      this.selectedLanguages().length > 0
    );
  }

  isSelected(
    type: 'subjects' | 'difficulties' | 'languages',
    value: string
  ): boolean {
    switch (type) {
      case 'subjects':
        return this.selectedSubjects().includes(value);
      case 'difficulties':
        return this.selectedDifficulties().includes(value);
      case 'languages':
        return this.selectedLanguages().includes(value);
    }
  }

  toggleFilter(type: string, value: string): void {
    this.filterChange.emit({ type, value });
  }
}
