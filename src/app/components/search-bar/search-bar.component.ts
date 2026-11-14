import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  OnInit,
  OnDestroy,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-bar">
      <label for="search-input" class="sr-only">Search explorations</label>
      <div class="search-input-wrapper">
        <svg class="search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          id="search-input"
          type="search"
          [ngModel]="inputValue()"
          (ngModelChange)="onInputChange($event)"
          placeholder="Search explorations by title, description, or tags…"
          autocomplete="off"
          aria-label="Search explorations"
        />
        @if (inputValue()) {
          <button
            class="clear-search-btn"
            (click)="clearSearch()"
            aria-label="Clear search"
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-bar {
      width: 100%;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
      pointer-events: none;
    }

    input {
      width: 100%;
      padding: 12px 44px 12px 44px;
      font-size: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--text-primary);
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }

    input::placeholder {
      color: var(--text-secondary);
    }

    input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-color-alpha);
    }

    .clear-search-btn {
      position: absolute;
      right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: var(--bg-muted);
      color: var(--text-secondary);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clear-search-btn:hover {
      background: var(--border-color);
    }

    .clear-search-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .clear-search-btn svg {
      width: 16px;
      height: 16px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  /** External value binding (for URL state restoration). */
  readonly initialQuery = input<string>('');

  /** Emits the debounced search query. */
  readonly queryChange = output<string>();

  readonly inputValue = signal('');

  private readonly inputSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    const initial = this.initialQuery();
    if (initial) {
      this.inputValue.set(initial);
    }

    this.subscription = this.inputSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.queryChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.inputSubject.next(value.trim());
  }

  clearSearch(): void {
    this.inputValue.set('');
    this.inputSubject.next('');
  }
}
