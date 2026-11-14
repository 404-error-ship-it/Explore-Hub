import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Exploration } from '../../models/exploration.model';
import { HighlightPipe } from '../../utils/highlight.pipe';

const SUBJECT_EMOJIS: Record<string, string> = {
  Mathematics: '🔢',
  Science: '🔬',
  Programming: '💻',
  Languages: '🌍',
  History: '🏛️',
  Art: '🎨',
};

@Component({
  selector: 'app-exploration-card',
  imports: [HighlightPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" (click)="navigate()" [attr.aria-label]="'Exploration: ' + exploration().title" tabindex="0" (keydown.enter)="navigate()" (keydown.space)="navigate()" [ngClass]="subjectClass()">
      <div class="card-thumbnail">
        <span class="card-thumbnail-emoji">{{ subjectEmoji() }}</span>
      </div>
      <div class="card-body">
        <div class="card-header">
          <span class="card-subject">{{ exploration().subject }}</span>
          <span class="card-difficulty" [attr.data-level]="exploration().difficulty">
            {{ exploration().difficulty }}
          </span>
        </div>
        <h3 class="card-title" [innerHTML]="exploration().title | highlight : query()"></h3>
        @if (exploration().description) {
          <p class="card-description">{{ exploration().description }}</p>
        } @else {
          <p class="card-description card-no-description">No description available</p>
        }
        <div class="card-meta">
          <span class="card-language">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
            </svg>
            {{ exploration().language }}
          </span>
          <span class="card-duration">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ exploration().durationMinutes }} min
          </span>
          <span class="card-rating">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {{ exploration().rating.toFixed(1) }}
          </span>
        </div>
        @if (exploration().tags.length > 0) {
          <div class="card-tags">
            @for (tag of exploration().tags.slice(0, 3); track tag) {
              <span class="tag">{{ tag }}</span>
            }
            @if (exploration().tags.length > 3) {
              <span class="tag tag-more">+{{ exploration().tags.length - 3 }}</span>
            }
          </div>
        }
        <div class="card-view-link">Start Learning →</div>
      </div>
    </article>
  `,
  styles: [`
    .card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card:hover, .card:focus {
      box-shadow: 0 8px 28px var(--shadow-color);
      transform: translateY(-4px);
      border-color: var(--primary-color);
      outline: none;
    }

    .card-thumbnail {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--subject-bg, var(--bg-muted));
      border-bottom: 1px solid var(--border-color);
    }

    .card-thumbnail-emoji {
      font-size: 2rem;
    }

    .card-body {
      padding: 16px 18px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .card-subject {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--subject-color, var(--primary-color));
    }

    .card-difficulty {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .card-difficulty[data-level="Beginner"] { background: #e8f5e9; color: #2e7d32; }
    .card-difficulty[data-level="Intermediate"] { background: #fff8e1; color: #ef6c00; }
    .card-difficulty[data-level="Advanced"] { background: #ffebee; color: #c62828; }

    :host-context([data-theme="dark"]) .card-difficulty[data-level="Beginner"] { background: #1b3a1b; color: #66bb6a; }
    :host-context([data-theme="dark"]) .card-difficulty[data-level="Intermediate"] { background: #3e2c1c; color: #ffa726; }
    :host-context([data-theme="dark"]) .card-difficulty[data-level="Advanced"] { background: #3e1c1c; color: #ef5350; }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.4;
    }

    :host ::ng-deep mark {
      background: var(--highlight-color);
      color: inherit;
      padding: 1px 2px;
      border-radius: 2px;
    }

    .card-description {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-no-description { font-style: italic; opacity: 0.6; }

    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .card-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-rating svg { color: var(--rating-color); }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      font-size: 0.6875rem;
      padding: 3px 8px;
      background: var(--bg-muted);
      color: var(--text-secondary);
      border-radius: 6px;
    }

    .tag-more { font-weight: 600; }

    .card-view-link {
      margin-top: auto;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--primary-color);
      padding-top: 4px;
    }
  `],
})
export class ExplorationCardComponent {
  readonly exploration = input.required<Exploration>();
  readonly query = input<string>('');
  private readonly router = inject(Router);

  navigate(): void {
    this.router.navigate(['/exploration', this.exploration().id]);
  }

  subjectClass(): string {
    const subject = this.exploration().subject;
    return `subject-${subject.toLowerCase()}`;
  }

  subjectEmoji(): string {
    return SUBJECT_EMOJIS[this.exploration().subject] ?? '📚';
  }
}
