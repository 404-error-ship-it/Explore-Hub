/**
 * @fileoverview Data models for the Exploration Gallery.
 *
 * Defines the core interfaces and types used throughout the application
 * to represent explorations and their filter criteria.
 */

/** Difficulty levels for an exploration. */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/** Sort options available for the gallery. */
export type SortOption =
  | 'relevance'
  | 'newest'
  | 'rating'
  | 'shortest'
  | 'title';

/** Display labels for sort options. */
export const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  newest: 'Newest',
  rating: 'Highest Rated',
  shortest: 'Shortest',
  title: 'Title A–Z',
};

/** All available subjects. */
export const SUBJECTS: readonly string[] = [
  'Mathematics',
  'Science',
  'Programming',
  'Languages',
  'History',
  'Art',
] as const;

/** All available difficulty levels. */
export const DIFFICULTIES: readonly Difficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
] as const;

/** All available languages. */
export const LANGUAGES: readonly string[] = [
  'English',
  'Hindi',
  'Marathi',
  'Spanish',
  'French',
] as const;

/**
 * Represents a single interactive exploration (lesson).
 *
 * Mirrors the metadata stored for each Oppia exploration.
 */
export interface Exploration {
  /** Unique identifier. */
  readonly id: string;
  /** Display title. */
  readonly title: string;
  /** Short description of the exploration (may be empty). */
  readonly description: string;
  /** Subject area (e.g. Mathematics, Science). */
  readonly subject: string;
  /** Difficulty level. */
  readonly difficulty: Difficulty;
  /** Language the exploration is offered in. */
  readonly language: string;
  /** Estimated completion time in minutes. */
  readonly durationMinutes: number;
  /** Author name. */
  readonly author: string;
  /** Average rating from 0 to 5. */
  readonly rating: number;
  /** Searchable tags (may be empty). */
  readonly tags: string[];
  /** ISO 8601 creation date. */
  readonly createdAt: string;
}

/**
 * Active filters applied to the gallery.
 *
 * Combination rule:
 * - OR within a single filter type (e.g. selecting both Mathematics and
 *   Science returns explorations in either subject).
 * - AND across different filter types and the search text (e.g. a subject
 *   filter combined with a difficulty filter only shows explorations that
 *   match both).
 */
export interface ExplorationFilters {
  /** Free-text search query. */
  readonly query: string;
  /** Selected subject filters. */
  readonly subjects: readonly string[];
  /** Selected difficulty filters. */
  readonly difficulties: readonly Difficulty[];
  /** Selected language filters. */
  readonly languages: readonly string[];
}

/** Pagination state. */
export interface PaginationState {
  /** Current page number (1-indexed). */
  readonly currentPage: number;
  /** Number of items per page. */
  readonly pageSize: number;
  /** Total number of items. */
  readonly totalItems: number;
  /** Total number of pages. */
  readonly totalPages: number;
}

/** Facet count for a single filter option. */
export interface FacetCount {
  /** The option value. */
  readonly value: string;
  /** Number of matching explorations. */
  readonly count: number;
}

/** Default (empty) filter state. */
export const DEFAULT_FILTERS: ExplorationFilters = {
  query: '',
  subjects: [],
  difficulties: [],
  languages: [],
};

/** Default page size for the gallery. */
export const PAGE_SIZE = 9;
