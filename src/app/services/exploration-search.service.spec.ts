/**
 * @fileoverview Unit tests for the exploration search service.
 *
 * Tests cover:
 * - Text matching (empty query, case-insensitivity, title/description/tags)
 * - Special characters that don't throw (c++, (, [, etc.)
 * - Filter combinations (OR within type, AND across types)
 * - Edge cases (missing description, empty tags, cancelling filters)
 * - Sorting (all 5 options)
 * - Pagination (boundaries, out-of-range)
 * - Facet counts
 */

import { describe, it, expect } from 'vitest';
import {
  escapeRegExp,
  matchesQuery,
  matchesFilters,
  filterExplorations,
  sortExplorations,
  paginate,
  totalPages,
  computeFacetCounts,
} from './exploration-search.service';
import {
  Exploration,
  ExplorationFilters,
  DEFAULT_FILTERS,
} from '../models/exploration.model';

// ─── Test Data ──────────────────────────────────────────────

function makeExploration(overrides: Partial<Exploration> = {}): Exploration {
  return {
    id: 'test-001',
    title: 'Test Exploration',
    description: 'A test description for unit tests.',
    subject: 'Mathematics',
    difficulty: 'Beginner',
    language: 'English',
    durationMinutes: 30,
    author: 'Test Author',
    rating: 4.0,
    tags: ['test', 'math'],
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

const sampleData: readonly Exploration[] = [
  makeExploration({
    id: '1',
    title: 'Introduction to Fractions',
    description: 'Learn about fractions and arithmetic.',
    subject: 'Mathematics',
    difficulty: 'Beginner',
    language: 'English',
    durationMinutes: 20,
    rating: 4.5,
    tags: ['fractions', 'arithmetic'],
    createdAt: '2025-01-15T10:00:00Z',
  }),
  makeExploration({
    id: '2',
    title: 'Algebra Basics',
    description: 'Explore variables and equations.',
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    language: 'Hindi',
    durationMinutes: 30,
    rating: 4.2,
    tags: ['algebra', 'equations'],
    createdAt: '2025-02-10T14:30:00Z',
  }),
  makeExploration({
    id: '3',
    title: 'The Solar System',
    description: 'Explore the planets in our solar system.',
    subject: 'Science',
    difficulty: 'Beginner',
    language: 'English',
    durationMinutes: 25,
    rating: 4.7,
    tags: ['solar-system', 'planets'],
    createdAt: '2025-01-20T09:00:00Z',
  }),
  makeExploration({
    id: '4',
    title: 'Data Structures in C++',
    description: 'Learn arrays, linked lists, and trees in C++.',
    subject: 'Programming',
    difficulty: 'Intermediate',
    language: 'English',
    durationMinutes: 50,
    rating: 4.5,
    tags: ['c++', 'data-structures'],
    createdAt: '2025-02-14T11:00:00Z',
  }),
  makeExploration({
    id: '5',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore generics and conditional types.',
    subject: 'Programming',
    difficulty: 'Advanced',
    language: 'English',
    durationMinutes: 55,
    rating: 4.7,
    tags: ['typescript', 'generics'],
    createdAt: '2025-03-22T16:00:00Z',
  }),
  makeExploration({
    id: '6',
    title: 'Español Intermedio',
    description: 'Mejora tu español hablado.',
    subject: 'Languages',
    difficulty: 'Intermediate',
    language: 'Spanish',
    durationMinutes: 30,
    rating: 4.3,
    tags: ['spanish', 'conversation'],
    createdAt: '2025-02-18T13:00:00Z',
  }),
  makeExploration({
    id: '7',
    title: 'Empty Description Entry',
    description: '', // Edge case: empty description
    subject: 'Art',
    difficulty: 'Beginner',
    language: 'Marathi',
    durationMinutes: 15,
    rating: 3.8,
    tags: ['art'],
    createdAt: '2025-04-01T10:00:00Z',
  }),
  makeExploration({
    id: '8',
    title: 'No Tags Entry',
    description: 'This entry has no tags.',
    subject: 'History',
    difficulty: 'Advanced',
    language: 'French',
    durationMinutes: 60,
    rating: 4.6,
    tags: [], // Edge case: empty tags
    createdAt: '2025-05-01T10:00:00Z',
  }),
];

// ═══════════════════════════════════════════════════════════
// escapeRegExp
// ═══════════════════════════════════════════════════════════

describe('escapeRegExp', () => {
  it('should escape all regex special characters', () => {
    expect(escapeRegExp('c++')).toBe('c\\+\\+');
    expect(escapeRegExp('(test)')).toBe('\\(test\\)');
    expect(escapeRegExp('[bracket]')).toBe('\\[bracket\\]');
    expect(escapeRegExp('a.b*c?d')).toBe('a\\.b\\*c\\?d');
    expect(escapeRegExp('$100')).toBe('\\$100');
    expect(escapeRegExp('a^b')).toBe('a\\^b');
    expect(escapeRegExp('a{2}')).toBe('a\\{2\\}');
    expect(escapeRegExp('a|b')).toBe('a\\|b');
    expect(escapeRegExp('a\\b')).toBe('a\\\\b');
  });

  it('should return unchanged string when there are no special characters', () => {
    expect(escapeRegExp('hello world')).toBe('hello world');
  });
});

// ═══════════════════════════════════════════════════════════
// matchesQuery
// ═══════════════════════════════════════════════════════════

describe('matchesQuery', () => {
  it('should return true for empty query', () => {
    expect(matchesQuery(sampleData[0], '')).toBe(true);
  });

  it('should match title case-insensitively', () => {
    expect(matchesQuery(sampleData[0], 'fractions')).toBe(true);
    expect(matchesQuery(sampleData[0], 'FRACTIONS')).toBe(true);
    expect(matchesQuery(sampleData[0], 'Fractions')).toBe(true);
  });

  it('should match description', () => {
    expect(matchesQuery(sampleData[0], 'arithmetic')).toBe(true);
  });

  it('should match tags', () => {
    expect(matchesQuery(sampleData[3], 'data-structures')).toBe(true);
  });

  it('should return false for non-matching query', () => {
    expect(matchesQuery(sampleData[0], 'quantum')).toBe(false);
  });

  it('should handle c++ without throwing', () => {
    expect(matchesQuery(sampleData[3], 'c++')).toBe(true);
  });

  it('should handle ( without throwing', () => {
    expect(() => matchesQuery(sampleData[0], '(')).not.toThrow();
  });

  it('should handle [ without throwing', () => {
    expect(() => matchesQuery(sampleData[0], '[')).not.toThrow();
  });

  it('should handle regex special chars without crashing', () => {
    const specialChars = ['(', ')', '[', ']', '{', '}', '*', '+', '?', '.', '^', '$', '|', '\\'];
    for (const char of specialChars) {
      expect(() => matchesQuery(sampleData[0], char)).not.toThrow();
    }
  });

  it('should handle empty description without crashing', () => {
    expect(matchesQuery(sampleData[6], 'anything')).toBe(false);
    expect(matchesQuery(sampleData[6], 'art')).toBe(true); // matches tag
  });

  it('should handle empty tags without crashing', () => {
    expect(matchesQuery(sampleData[7], 'no tags')).toBe(false);
    expect(matchesQuery(sampleData[7], 'no tags')).toBe(false);
    expect(matchesQuery(sampleData[7], 'No Tags')).toBe(true); // matches title
  });
});

// ═══════════════════════════════════════════════════════════
// matchesFilters
// ═══════════════════════════════════════════════════════════

describe('matchesFilters', () => {
  it('should return true with default (empty) filters', () => {
    expect(matchesFilters(sampleData[0], DEFAULT_FILTERS)).toBe(true);
  });

  it('should filter by subject', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      subjects: ['Mathematics'],
    };
    expect(matchesFilters(sampleData[0], filters)).toBe(true); // Math
    expect(matchesFilters(sampleData[2], filters)).toBe(false); // Science
  });

  it('should filter by difficulty', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      difficulties: ['Advanced'],
    };
    expect(matchesFilters(sampleData[4], filters)).toBe(true); // Advanced
    expect(matchesFilters(sampleData[0], filters)).toBe(false); // Beginner
  });

  it('should filter by language', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      languages: ['Spanish'],
    };
    expect(matchesFilters(sampleData[5], filters)).toBe(true); // Spanish
    expect(matchesFilters(sampleData[0], filters)).toBe(false); // English
  });

  it('should OR within one filter type', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      subjects: ['Mathematics', 'Science'],
    };
    expect(matchesFilters(sampleData[0], filters)).toBe(true); // Math
    expect(matchesFilters(sampleData[2], filters)).toBe(true); // Science
    expect(matchesFilters(sampleData[3], filters)).toBe(false); // Programming
  });

  it('should AND across filter types', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      subjects: ['Mathematics'],
      difficulties: ['Beginner'],
    };
    expect(matchesFilters(sampleData[0], filters)).toBe(true); // Math + Beginner
    expect(matchesFilters(sampleData[1], filters)).toBe(false); // Math + Intermediate
    expect(matchesFilters(sampleData[2], filters)).toBe(false); // Science + Beginner
  });

  it('should AND across all three filter types', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      subjects: ['Mathematics'],
      difficulties: ['Beginner'],
      languages: ['English'],
    };
    expect(matchesFilters(sampleData[0], filters)).toBe(true); // Math + Beginner + English
    expect(matchesFilters(sampleData[1], filters)).toBe(false); // Math + Intermediate + Hindi
  });

  it('should AND query with filters', () => {
    const filters: ExplorationFilters = {
      query: 'fraction',
      subjects: ['Mathematics'],
      difficulties: [],
      languages: [],
    };
    expect(matchesFilters(sampleData[0], filters)).toBe(true); // "Fractions" + Math
    expect(matchesFilters(sampleData[1], filters)).toBe(false); // No match on "fraction"
  });

  it('should return empty when filters cancel each other out', () => {
    // Searching for "fractions" but filtering by Science -> no matches
    const filters: ExplorationFilters = {
      query: 'fractions',
      subjects: ['Science'],
      difficulties: [],
      languages: [],
    };
    const results = filterExplorations(sampleData, filters);
    expect(results).toHaveLength(0);
  });

  it('should handle query with leading/trailing spaces', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      query: '  fractions  ',
    };
    const results = filterExplorations(sampleData, filters);
    expect(results.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════
// filterExplorations
// ═══════════════════════════════════════════════════════════

describe('filterExplorations', () => {
  it('should return all items with empty filters', () => {
    const results = filterExplorations(sampleData, DEFAULT_FILTERS);
    expect(results).toHaveLength(sampleData.length);
  });

  it('should return empty array when no matches', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      query: 'xyznonexistent',
    };
    expect(filterExplorations(sampleData, filters)).toHaveLength(0);
  });

  it('should filter with missing description without crash', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      query: 'test',
    };
    const data = [
      makeExploration({ id: 'x', description: '', title: 'Test' }),
    ];
    const results = filterExplorations(data, filters);
    expect(results).toHaveLength(1);
  });

  it('should filter with missing tags without crash', () => {
    const data = [
      makeExploration({ id: 'x', tags: [], title: 'Hello' }),
    ];
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      query: 'hello',
    };
    const results = filterExplorations(data, filters);
    expect(results).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════
// sortExplorations
// ═══════════════════════════════════════════════════════════

describe('sortExplorations', () => {
  it('should sort by newest (createdAt descending)', () => {
    const sorted = sortExplorations(sampleData, 'newest', false);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(
        new Date(sorted[i].createdAt).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(sorted[i + 1].createdAt).getTime()
      );
    }
  });

  it('should sort by rating (descending)', () => {
    const sorted = sortExplorations(sampleData, 'rating', false);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i + 1].rating);
    }
  });

  it('should sort by shortest (duration ascending)', () => {
    const sorted = sortExplorations(sampleData, 'shortest', false);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].durationMinutes).toBeLessThanOrEqual(
        sorted[i + 1].durationMinutes
      );
    }
  });

  it('should sort by title A–Z', () => {
    const sorted = sortExplorations(sampleData, 'title', false);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(
        sorted[i].title.localeCompare(sorted[i + 1].title, undefined, {
          sensitivity: 'base',
        })
      ).toBeLessThanOrEqual(0);
    }
  });

  it('should not mutate the original array', () => {
    const original = [...sampleData];
    sortExplorations(sampleData, 'newest', false);
    expect(sampleData).toEqual(original);
  });

  it('should sort by relevance (=newest) when no query', () => {
    const sorted = sortExplorations(sampleData, 'relevance', false);
    // Same as newest
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(
        new Date(sorted[i].createdAt).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(sorted[i + 1].createdAt).getTime()
      );
    }
  });

  it('should keep filter-order for relevance when query is active', () => {
    const sorted = sortExplorations(sampleData, 'relevance', true);
    // When query is active, relevance preserves the original order
    expect(sorted).toEqual([...sampleData]);
  });
});

// ═══════════════════════════════════════════════════════════
// paginate
// ═══════════════════════════════════════════════════════════

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it('should return the first page', () => {
    expect(paginate(items, 1, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should return the second page', () => {
    expect(paginate(items, 2, 9)).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
  });

  it('should return the last page (partial)', () => {
    expect(paginate(items, 3, 9)).toEqual([18, 19, 20, 21, 22, 23, 24]);
  });

  it('should clamp out-of-range page (too high) to the last page', () => {
    expect(paginate(items, 100, 9)).toEqual([18, 19, 20, 21, 22, 23, 24]);
  });

  it('should clamp page 0 to page 1', () => {
    expect(paginate(items, 0, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should clamp negative page to page 1', () => {
    expect(paginate(items, -5, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should return all items if they fit in one page', () => {
    const small = [1, 2, 3];
    expect(paginate(small, 1, 9)).toEqual([1, 2, 3]);
  });

  it('should return empty array for empty input (still page 1)', () => {
    expect(paginate([], 1, 9)).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════
// totalPages
// ═══════════════════════════════════════════════════════════

describe('totalPages', () => {
  it('should return 1 for 0 items', () => {
    expect(totalPages(0, 9)).toBe(1);
  });

  it('should return 1 for items fewer than page size', () => {
    expect(totalPages(5, 9)).toBe(1);
  });

  it('should return correct page count', () => {
    expect(totalPages(25, 9)).toBe(3);
    expect(totalPages(27, 9)).toBe(3);
    expect(totalPages(28, 9)).toBe(4);
  });
});

// ═══════════════════════════════════════════════════════════
// computeFacetCounts
// ═══════════════════════════════════════════════════════════

describe('computeFacetCounts', () => {
  it('should count subjects correctly with no filters', () => {
    const counts = computeFacetCounts(
      sampleData,
      DEFAULT_FILTERS,
      'subjects',
      ['Mathematics', 'Science', 'Programming', 'Languages', 'History', 'Art']
    );

    const mathCount = counts.find((c) => c.value === 'Mathematics');
    expect(mathCount?.count).toBe(2);

    const scienceCount = counts.find((c) => c.value === 'Science');
    expect(scienceCount?.count).toBe(1);

    const progCount = counts.find((c) => c.value === 'Programming');
    expect(progCount?.count).toBe(2);
  });

  it('should adjust counts based on other active filters', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      languages: ['English'],
    };

    const counts = computeFacetCounts(
      sampleData,
      filters,
      'subjects',
      ['Mathematics', 'Science', 'Programming', 'Languages', 'History', 'Art']
    );

    // Mathematics: only id=1 is English (id=2 is Hindi)
    const mathCount = counts.find((c) => c.value === 'Mathematics');
    expect(mathCount?.count).toBe(1);
  });

  it('should return zero counts for non-matching options', () => {
    const filters: ExplorationFilters = {
      ...DEFAULT_FILTERS,
      query: 'fractions',
    };

    const counts = computeFacetCounts(
      sampleData,
      filters,
      'subjects',
      ['Mathematics', 'Science', 'Programming']
    );

    const scienceCount = counts.find((c) => c.value === 'Science');
    expect(scienceCount?.count).toBe(0);
  });

  it('should compute difficulty facet counts', () => {
    const counts = computeFacetCounts(
      sampleData,
      DEFAULT_FILTERS,
      'difficulties',
      ['Beginner', 'Intermediate', 'Advanced']
    );

    const beginnerCount = counts.find((c) => c.value === 'Beginner');
    const intermediateCount = counts.find((c) => c.value === 'Intermediate');
    const advancedCount = counts.find((c) => c.value === 'Advanced');

    expect(beginnerCount?.count).toBe(3); // ids 1, 3, 7
    expect(intermediateCount?.count).toBe(3); // ids 2, 4, 6
    expect(advancedCount?.count).toBe(2); // ids 5, 8
  });

  it('should compute language facet counts', () => {
    const counts = computeFacetCounts(
      sampleData,
      DEFAULT_FILTERS,
      'languages',
      ['English', 'Hindi', 'Spanish', 'French', 'Marathi']
    );

    const englishCount = counts.find((c) => c.value === 'English');
    expect(englishCount?.count).toBe(4); // ids 1, 3, 4, 5
  });
});
