import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { Exploration } from '../../models/exploration.model';
import { ExplorationCardComponent } from '../exploration-card/exploration-card.component';

@Component({
  selector: 'app-results-grid',
  imports: [ExplorationCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="results-grid" role="list" aria-label="Exploration results">
      @for (exploration of explorations(); track exploration.id) {
        <div role="listitem">
          <app-exploration-card
            [exploration]="exploration"
            [query]="query()"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    @media (max-width: 640px) {
      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ResultsGridComponent {
  readonly explorations = input.required<readonly Exploration[]>();
  readonly query = input<string>('');
}
