/**
 * @fileoverview Highlight pipe that wraps matched text in <mark> tags.
 *
 * Renders safely — never uses innerHTML with raw user input.
 * The pipe escapes regex special characters before matching.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { escapeRegExp } from '../services/exploration-search.service';

@Pipe({
  name: 'highlight',
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * Wraps all occurrences of `query` in `text` with `<mark>` tags.
   *
   * @param text - The source text to highlight within
   * @param query - The search query (may be empty)
   * @returns SafeHtml with matched portions wrapped in `<mark>`
   */
  transform(text: string, query: string): SafeHtml {
    if (!query || !text) {
      return text || '';
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return text;
    }

    const escaped = escapeRegExp(trimmed);
    const regex = new RegExp(`(${escaped})`, 'gi');

    // Escape HTML entities in the source text first, then wrap matches
    const safeText = this.escapeHtml(text);
    const safeQuery = this.escapeHtml(trimmed);
    const safeEscaped = escapeRegExp(safeQuery);
    const safeRegex = new RegExp(`(${safeEscaped})`, 'gi');

    const highlighted = safeText.replace(
      safeRegex,
      '<mark>$1</mark>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeHtml(text: string): string {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.textContent = text;
      return div.innerHTML;
    }
    // Fallback for SSR
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
