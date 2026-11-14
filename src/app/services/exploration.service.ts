/**
 * @fileoverview Service that provides exploration data.
 *
 * Currently returns mock data through an Observable. Replace the
 * implementation with an HttpClient call to swap in a real API.
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Exploration } from '../models/exploration.model';
import { MOCK_EXPLORATIONS } from '../data/mock-explorations';

@Injectable({ providedIn: 'root' })
export class ExplorationService {
  /**
   * Fetches all explorations.
   *
   * @returns An Observable that emits the full list of explorations after
   *          a simulated network delay of 300 ms.
   */
  getAll(): Observable<readonly Exploration[]> {
    return of([...MOCK_EXPLORATIONS]).pipe(delay(300));
  }

  /**
   * Synchronously retrieves a single exploration by ID from the mock data.
   *
   * @param id - The exploration ID
   * @returns The matching exploration or null
   */
  getById(id: string): Exploration | null {
    return MOCK_EXPLORATIONS.find((e) => e.id === id) ?? null;
  }

  /**
   * Fetches a single exploration as an Observable (with simulated delay).
   */
  getById$(id: string): Observable<Exploration | null> {
    return of(this.getById(id)).pipe(delay(200));
  }
}
