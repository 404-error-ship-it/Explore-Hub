/**
 * @fileoverview Pure functions for filtering, sorting, paginating, and
 * computing facet counts on explorations.
 *
 * All logic is kept as pure functions so it is trivially unit-testable
 * and free of framework dependencies.
 */

import {
  Exploration,
  ExplorationFilters,
  FacetCount,
  SortOption,
  PAGE_SIZE,
} from '../models/exploration.model';

/**
 * Escapes special RegExp characters so user input is treated as plain text.
 *
 * @param text - Raw user input
 * @returns Escaped string safe for `new RegExp()`
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks whether an exploration matches a text query.
 *
 * Matches case-insensitively against title, description, and tags.
 * An empty query matches everything.
 *
 * @param exploration - The exploration to test
 * @param query - Trimmed, non-empty search query
 * @returns `true` if the exploration matches the query
 */
export function matchesQuery(
  exploration: Exploration,
  query: string
): boolean {
  if (!query) return true;

  const escaped = escapeRegExp(query);
  const regex = new RegExp(escaped, 'i');

  if (regex.test(exploration.title)) return true;
  if (exploration.description && regex.test(exploration.description))
    return true;
  if (
    exploration.tags &&
    exploration.tags.some((tag) => regex.test(tag))
  )
    return true;

  return false;
}

/**
 * Checks whether an exploration matches the given filters.
 *
 * Combination rule: OR within one filter type, AND across filter types.
 *
 * @param exploration - The exploration to test
 * @param filters - Active filter criteria
 * @returns `true` if the exploration passes all active filters
 */
export function matchesFilters(
  exploration: Exploration,
  filters: ExplorationFilters
): boolean {
  const query = filters.query.trim();
  if (!matchesQuery(exploration, query)) return false;

  if (
    filters.subjects.length > 0 &&
    !filters.subjects.includes(exploration.subject)
  )
    return false;

  if (
    filters.difficulties.length > 0 &&
    !filters.difficulties.includes(exploration.difficulty)
  )
    return false;

  if (
    filters.languages.length > 0 &&
    !filters.languages.includes(exploration.language)
  )
    return false;

  return true;
}

/**
 * Filters an array of explorations using the given criteria.
 *
 * @param explorations - Full list of explorations
 * @param filters - Active filter criteria
 * @returns Filtered array (never mutates the original)
 */
export function filterExplorations(
  explorations: readonly Exploration[],
  filters: ExplorationFilters
): Exploration[] {
  return explorations.filter((e) => matchesFilters(e, filters));
}

/**
 * Sorts explorations by the given option.
 *
 * @param explorations - Array to sort (not mutated; a copy is returned)
 * @param sort - The sort criterion
 * @param hasQuery - Whether a search query is active (affects relevance sort)
 * @returns A new sorted array
 */
export function sortExplorations(
  explorations: readonly Exploration[],
  sort: SortOption,
  hasQuery: boolean
): Exploration[] {
  const copy = [...explorations];

  switch (sort) {
    case 'relevance':
      // When there is no query, relevance = newest
      if (!hasQuery) {
        copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
      }
      // When there IS a query, keep the filter-order (match quality)
      break;

    case 'newest':
      copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
      break;

    case 'rating':
      copy.sort((a, b) => b.rating - a.rating);
      break;

    case 'shortest':
      copy.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;

    case 'title':
      copy.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, {
          sensitivity: 'base',
        })
      );
      break;
  }

  return copy;
}

/**
 * Paginates an array.
 *
 * @param items - Full sorted/filtered array
 * @param page - 1-indexed page number
 * @param pageSize - Items per page (defaults to PAGE_SIZE)
 * @returns The slice of items for the requested page
 */
export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number = PAGE_SIZE
): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Calculates the total number of pages.
 *
 * @param totalItems - Total item count
 * @param pageSize - Items per page
 * @returns Number of pages (minimum 1)
 */
export function totalPages(
  totalItems: number,
  pageSize: number = PAGE_SIZE
): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Computes facet counts for a given field.
 *
 * For each option value, counts how many explorations would match if
 * that option were selected — given the OTHER active filters (excluding
 * the filter type being counted). This lets the UI show accurate counts
 * even when filters are combined.
 *
 * @param explorations - Full unfiltered list
 * @param filters - Current filter state
 * @param field - Which filter field to compute counts for
 * @param options - The list of possible option values
 * @returns Array of `{ value, count }` pairs
 */
export function computeFacetCounts(
  explorations: readonly Exploration[],
  filters: ExplorationFilters,
  field: 'subjects' | 'difficulties' | 'languages',
  options: readonly string[]
): FacetCount[] {
  // Build a filter set that excludes the target field
  const baseFilters: ExplorationFilters = {
    ...filters,
    [field]: [],
  };

  // Pre-filter by the other criteria
  const baseResults = explorations.filter((e) =>
    matchesFilters(e, baseFilters)
  );

  // Map each option value to its count within the base results
  const fieldKey: keyof Exploration =
    field === 'subjects'
      ? 'subject'
      : field === 'difficulties'
        ? 'difficulty'
        : 'language';

  return options.map((value) => ({
    value,
    count: baseResults.filter((e) => e[fieldKey] === value).length,
  }));
}
