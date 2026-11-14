/**
 * @fileoverview Gallery page component — the main container that owns all
 * state (signals), orchestrates filtering/sorting/pagination, and syncs
 * state to/from URL query parameters.
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  computed,
  signal,
  effect,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ExplorationService } from '../../services/exploration.service';
import { AuthService } from '../../services/auth.service';
import {
  filterExplorations,
  sortExplorations,
  paginate,
  totalPages,
  computeFacetCounts,
} from '../../services/exploration-search.service';
import {
  Exploration,
  ExplorationFilters,
  Difficulty,
  SortOption,
  DEFAULT_FILTERS,
  PAGE_SIZE,
  SUBJECTS,
  DIFFICULTIES,
  LANGUAGES,
  SORT_LABELS,
} from '../../models/exploration.model';

import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import {
  FilterChipsComponent,
  FilterChip,
} from '../filter-chips/filter-chips.component';
import { ResultsGridComponent } from '../results-grid/results-grid.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-gallery',
  imports: [
    SearchBarComponent,
    FilterPanelComponent,
    FilterChipsComponent,
    ResultsGridComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Learn anything.<br>Teach anyone.</h1>
        <p class="hero-subtitle">
          Discover interactive lessons across subjects, levels, and languages.
          Learn by doing with immediate feedback and track your progress.
        </p>
        <div class="hero-cta">
          <button class="hero-btn primary" (click)="scrollToGallery()" type="button">
            Browse Lessons
          </button>
          @if (!isAuthenticated()) {
            <button class="hero-btn secondary" (click)="scrollToGallery()" type="button">
              Explore Freely
            </button>
          }
        </div>
      </div>
      <div class="hero-illustration" aria-hidden="true">
        <div class="hero-card hero-card-1">
          <span class="hero-emoji">📖</span>
        </div>
        <div class="hero-card hero-card-2">
          <span class="hero-emoji">🧮</span>
        </div>
        <div class="hero-card hero-card-3">
          <span class="hero-emoji">🔬</span>
        </div>
        <div class="hero-card hero-card-4">
          <span class="hero-emoji">💻</span>
        </div>
        <div class="hero-card hero-card-5">
          <span class="hero-emoji">🎨</span>
        </div>
      </div>
    </section>

    <!-- Subject Quick Access -->
    <section class="subjects-section">
      <div class="subjects-inner">
        <h2 class="section-title">Explore by Subject</h2>
        <div class="subjects-grid">
          @for (subject of subjectCards; track subject.name) {
            <button class="subject-card" (click)="selectSubject(subject.name)" type="button"
              [style.--subject-color]="subject.color" [style.--subject-bg]="subject.bg">
              <span class="subject-emoji">{{ subject.emoji }}</span>
              <span class="subject-name">{{ subject.name }}</span>
              <span class="subject-count">{{ subject.count }} lessons</span>
            </button>
          }
        </div>
      </div>
    </section>

    <div class="gallery-container" #galleryAnchor>
      <!-- Header -->
      <header class="gallery-header">
        <div class="header-top">
          <div>
            <h1>Exploration Gallery</h1>
            <p class="header-subtitle">
              Discover interactive lessons across subjects, levels, and languages
            </p>
          </div>
          <button
            class="theme-toggle"
            (click)="toggleTheme()"
            [attr.aria-label]="'Switch to ' + (isDarkMode() ? 'light' : 'dark') + ' mode'"
            type="button"
          >
            @if (isDarkMode()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>
        </div>
        <app-search-bar
          [initialQuery]="filters().query"
          (queryChange)="onQueryChange($event)"
        />
      </header>

      <div class="gallery-body">
        <!-- Sidebar Filters -->
        <div class="gallery-sidebar" [class.sidebar-open]="sidebarOpen()">
          <app-filter-panel
            [selectedSubjects]="filters().subjects"
            [selectedDifficulties]="filters().difficulties"
            [selectedLanguages]="filters().languages"
            [subjectCounts]="subjectFacetCounts()"
            [difficultyCounts]="difficultyFacetCounts()"
            [languageCounts]="languageFacetCounts()"
            (filterChange)="onFilterChange($event)"
            (clearAll)="clearAllFilters()"
          />
        </div>

        <!-- Main Content -->
        <main class="gallery-main">
          <!-- Mobile filter toggle -->
          <button
            class="mobile-filter-toggle"
            (click)="sidebarOpen.set(!sidebarOpen())"
            type="button"
            aria-label="Toggle filters"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="filter-badge">{{ activeFilterCount() }}</span>
            }
          </button>

          <!-- Toolbar: sort + result count -->
          <div class="gallery-toolbar">
            <div class="result-count" aria-live="polite">
              @if (isLoading()) {
                Loading explorations…
              } @else if (isError()) {
                <!-- Error — no count -->
              } @else {
                Showing {{ paginatedResults().length }} of {{ filteredResults().length }} explorations
              }
            </div>

            <div class="sort-control">
              <label for="sort-select" class="sr-only">Sort by</label>
              <select
                id="sort-select"
                [value]="sortOption()"
                (change)="onSortChange($event)"
                aria-label="Sort explorations"
              >
                @for (opt of sortOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Active filter chips -->
          <app-filter-chips
            [chips]="activeChips()"
            (removeChip)="removeChip($event)"
            (clearAll)="clearAllFilters()"
          />

          <!-- Content area -->
          @if (isLoading()) {
            <div class="skeleton-grid" aria-label="Loading explorations" role="status">
              @for (i of skeletonItems; track i) {
                <div class="skeleton-card">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line medium"></div>
                  <div class="skeleton-line long"></div>
                  <div class="skeleton-line long"></div>
                  <div class="skeleton-meta">
                    <div class="skeleton-line tiny"></div>
                    <div class="skeleton-line tiny"></div>
                    <div class="skeleton-line tiny"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (isError()) {
            <app-empty-state
              [isError]="true"
              (retry)="loadExplorations()"
            />
          } @else if (filteredResults().length === 0) {
            <app-empty-state
              [isError]="false"
              (clearFilters)="clearAllFilters()"
            />
          } @else {
            <app-results-grid
              [explorations]="paginatedResults()"
              [query]="filters().query"
            />
            <app-pagination
              [currentPage]="currentPage()"
              [totalPages]="totalPageCount()"
              (pageChange)="onPageChange($event)"
            />
          }
        </main>
      </div>
    </div>
  `,
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  private readonly explorationService = inject(ExplorationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('galleryAnchor') galleryAnchor?: ElementRef;

  // ─── State Signals ──────────────────────────────────────────
  readonly allExplorations = signal<readonly Exploration[]>([]);
  readonly isLoading = signal(true);
  readonly isError = signal(false);
  readonly filters = signal<ExplorationFilters>({ ...DEFAULT_FILTERS });
  readonly sortOption = signal<SortOption>('relevance');
  readonly currentPage = signal(1);
  readonly isDarkMode = signal(false);
  readonly sidebarOpen = signal(false);

  // ─── Auth State ─────────────────────────────────────────────
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = this.authService.isAuthenticated;

  // ─── Subject Cards ─────────────────────────────────────────
  readonly subjectCards = [
    { name: 'Mathematics', emoji: '🔢', color: '#1565c0', bg: '#e3f2fd', count: 7 },
    { name: 'Science', emoji: '🔬', color: '#2e7d32', bg: '#e8f5e9', count: 6 },
    { name: 'Programming', emoji: '💻', color: '#6a1b9a', bg: '#f3e5f5', count: 7 },
    { name: 'Languages', emoji: '🌍', color: '#e65100', bg: '#fff3e0', count: 6 },
    { name: 'History', emoji: '🏛️', color: '#c62828', bg: '#ffebee', count: 7 },
    { name: 'Art', emoji: '🎨', color: '#00838f', bg: '#e0f7fa', count: 9 },
  ];

  scrollToGallery(): void {
    this.galleryAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  selectSubject(subject: string): void {
    this.onFilterChange({ type: 'subjects', value: subject });
    this.scrollToGallery();
  }

  // ─── Computed Values ────────────────────────────────────────
  readonly filteredResults = computed(() =>
    sortExplorations(
      filterExplorations(this.allExplorations(), this.filters()),
      this.sortOption(),
      this.filters().query.trim().length > 0
    )
  );

  readonly totalPageCount = computed(() =>
    totalPages(this.filteredResults().length, PAGE_SIZE)
  );

  readonly paginatedResults = computed(() =>
    paginate(this.filteredResults(), this.currentPage(), PAGE_SIZE)
  );

  readonly subjectFacetCounts = computed(() =>
    computeFacetCounts(
      this.allExplorations(),
      this.filters(),
      'subjects',
      SUBJECTS
    )
  );

  readonly difficultyFacetCounts = computed(() =>
    computeFacetCounts(
      this.allExplorations(),
      this.filters(),
      'difficulties',
      DIFFICULTIES
    )
  );

  readonly languageFacetCounts = computed(() =>
    computeFacetCounts(
      this.allExplorations(),
      this.filters(),
      'languages',
      LANGUAGES
    )
  );

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    return f.subjects.length + f.difficulties.length + f.languages.length;
  });

  readonly activeChips = computed((): FilterChip[] => {
    const f = this.filters();
    const chips: FilterChip[] = [];

    if (f.query.trim()) {
      chips.push({
        type: 'query',
        value: f.query.trim(),
        label: 'Search',
      });
    }

    for (const s of f.subjects) {
      chips.push({ type: 'subjects', value: s, label: 'Subject' });
    }
    for (const d of f.difficulties) {
      chips.push({
        type: 'difficulties',
        value: d,
        label: 'Difficulty',
      });
    }
    for (const l of f.languages) {
      chips.push({ type: 'languages', value: l, label: 'Language' });
    }

    return chips;
  });

  // ─── Sort Options ──────────────────────────────────────────
  readonly sortOptions = Object.entries(SORT_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  readonly skeletonItems = Array.from({ length: 9 }, (_, i) => i);

  // ─── URL Sync Effect ───────────────────────────────────────
  private urlSyncEffect = effect(() => {
    const f = this.filters();
    const sort = this.sortOption();
    const page = this.currentPage();

    const queryParams: Record<string, string | null> = {
      q: f.query.trim() || null,
      subject: f.subjects.length ? f.subjects.join(',') : null,
      level: f.difficulties.length ? f.difficulties.join(',') : null,
      lang: f.languages.length ? f.languages.join(',') : null,
      sort: sort !== 'relevance' ? sort : null,
      page: page > 1 ? String(page) : null,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  });

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // Restore state from URL
    this.restoreFromUrl();

    // Restore theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Load data
    this.loadExplorations();

    // Listen for browser back/forward
    this.subscription = this.route.queryParams.subscribe(() => {
      // Only restore if not triggered by our own sync
      // We use a flag to avoid infinite loops
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // ─── Actions ────────────────────────────────────────────────

  loadExplorations(): void {
    this.isLoading.set(true);
    this.isError.set(false);

    this.explorationService.getAll().subscribe({
      next: (data) => {
        this.allExplorations.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isError.set(true);
      },
    });
  }

  onQueryChange(query: string): void {
    this.filters.update((f) => ({ ...f, query }));
    this.currentPage.set(1);
  }

  onFilterChange(event: { type: string; value: string }): void {
    this.filters.update((f) => {
      const key = event.type as keyof Pick<
        ExplorationFilters,
        'subjects' | 'difficulties' | 'languages'
      >;
      const current = f[key] as readonly string[];
      const updated = current.includes(event.value)
        ? current.filter((v) => v !== event.value)
        : [...current, event.value];

      return { ...f, [key]: updated };
    });
    this.currentPage.set(1);
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.set(select.value as SortOption);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeChip(chip: FilterChip): void {
    if (chip.type === 'query') {
      this.filters.update((f) => ({ ...f, query: '' }));
    } else {
      this.onFilterChange({ type: chip.type, value: chip.value });
    }
    this.currentPage.set(1);
  }

  clearAllFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
    this.sortOption.set('relevance');
    this.currentPage.set(1);
    this.sidebarOpen.set(false);
  }

  toggleTheme(): void {
    const dark = !this.isDarkMode();
    this.isDarkMode.set(dark);
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'dark' : 'light'
    );
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  // ─── URL Restore ────────────────────────────────────────────

  private restoreFromUrl(): void {
    const params = this.route.snapshot.queryParams;

    const query = (params['q'] as string) || '';
    const subjects = params['subject']
      ? (params['subject'] as string).split(',')
      : [];
    const difficulties = params['level']
      ? ((params['level'] as string).split(',') as Difficulty[])
      : [];
    const languages = params['lang']
      ? (params['lang'] as string).split(',')
      : [];
    const sort = (params['sort'] as SortOption) || 'relevance';
    const page = parseInt(params['page'] as string, 10) || 1;

    this.filters.set({ query, subjects, difficulties, languages });
    this.sortOption.set(sort);
    this.currentPage.set(page);
  }
}
