import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination" aria-label="Pagination">
        <button
          class="page-btn"
          [disabled]="currentPage() <= 1"
          (click)="pageChange.emit(currentPage() - 1)"
          aria-label="Previous page"
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        @for (page of getPages(); track page) {
          @if (page === -1) {
            <span class="page-ellipsis" aria-hidden="true">…</span>
          } @else {
            <button
              class="page-btn"
              [class.active]="page === currentPage()"
              (click)="pageChange.emit(page)"
              [attr.aria-label]="'Page ' + page"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              type="button"
            >
              {{ page }}
            </button>
          }
        }

        <button
          class="page-btn"
          [disabled]="currentPage() >= totalPages()"
          (click)="pageChange.emit(currentPage() + 1)"
          aria-label="Next page"
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </nav>
    }
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: 24px;
    }

    .page-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      padding: 4px 8px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .page-btn:hover:not(:disabled):not(.active) {
      background: var(--bg-muted);
      border-color: var(--text-secondary);
    }

    .page-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .page-ellipsis {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: var(--text-secondary);
    }
  `],
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  /**
   * Generates a page number array with ellipsis placeholders (-1).
   * Shows at most 7 page buttons.
   */
  getPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push(-1); // ellipsis
    }

    // Pages around the current page
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push(-1); // ellipsis
    }

    // Always show last page
    pages.push(total);

    return pages;
  }
}
