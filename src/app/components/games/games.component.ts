import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';

interface MemoryCard {
  id: number;
  label: string;
  emoji: string;
  matched: boolean;
}

interface SpeedQuestion {
  question: string;
  options: string[];
  correct: number;
}

type GameType = 'memory' | 'speed' | 'sequence';

@Component({
  selector: 'app-games',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="games-container">
      <h1 class="games-title">🎮 Learning Games</h1>
      <p class="games-subtitle">Take a break and sharpen your mind!</p>

      <!-- Game Selector -->
      <div class="game-tabs">
        <button class="game-tab" [class.active]="activeGame() === 'memory'" (click)="activeGame.set('memory')" type="button">
          🧠 Memory Match
        </button>
        <button class="game-tab" [class.active]="activeGame() === 'speed'" (click)="activeGame.set('speed')" type="button">
          ⚡ Speed Quiz
        </button>
        <button class="game-tab" [class.active]="activeGame() === 'sequence'" (click)="activeGame.set('sequence')" type="button">
          🔢 Number Sequence
        </button>
      </div>

      <!-- Memory Match Game -->
      @if (activeGame() === 'memory') {
        <div class="game-panel">
          @if (!memoryStarted()) {
            <div class="game-intro">
              <h2>Memory Match</h2>
              <p>Flip the cards to find matching pairs. Match all 8 pairs to win!</p>
              <button class="game-start-btn" (click)="startMemory()" type="button">Start Game</button>
            </div>
          } @else if (memoryWon()) {
            <div class="game-win">
              <h2>🎉 You Won!</h2>
              <p>Moves: {{ memoryMoves() }} · Time: {{ memoryTime() }}s</p>
              <button class="game-start-btn" (click)="startMemory()" type="button">Play Again</button>
            </div>
          } @else {
            <div class="game-stats">
              <span>Moves: {{ memoryMoves() }}</span>
              <span>Matched: {{ matchedCount() }}/8</span>
              <span>Time: {{ memoryTime() }}s</span>
            </div>
            <div class="memory-grid">
              @for (card of memoryCards(); track card.id) {
                <button
                  class="memory-card"
                  [class.flipped]="card.matched || flippedCards().includes(card.id)"
                  [class.matched]="card.matched"
                  (click)="flipCard(card.id)"
                  type="button"
                  [disabled]="card.matched"
                  [attr.aria-label]="card.label"
                >
                  @if (card.matched || flippedCards().includes(card.id)) {
                    <span class="card-emoji">{{ card.emoji }}</span>
                    <span class="card-label">{{ card.label }}</span>
                  } @else {
                    <span class="card-back">?</span>
                  }
                </button>
              }
            </div>
          }
        </div>
      }

      <!-- Speed Quiz Game -->
      @if (activeGame() === 'speed') {
        <div class="game-panel">
          @if (!speedStarted()) {
            <div class="game-intro">
              <h2>Speed Quiz</h2>
              <p>Answer as many questions as you can in 60 seconds. Each correct answer earns 10 points!</p>
              <button class="game-start-btn" (click)="startSpeed()" type="button">Start Quiz</button>
            </div>
          } @else if (speedFinished()) {
            <div class="game-win">
              <h2>⏰ Time's Up!</h2>
              <p>Score: {{ speedScore() }} points</p>
              <p>Correct: {{ speedCorrect() }} · Wrong: {{ speedWrong() }}</p>
              <button class="game-start-btn" (click)="startSpeed()" type="button">Play Again</button>
            </div>
          } @else {
            <div class="game-stats">
              <span class="speed-timer" [class.urgent]="speedTime() <= 10">⏱️ {{ speedTime() }}s</span>
              <span>Score: {{ speedScore() }}</span>
            </div>
            <div class="speed-question">
              @if (speedCurrent()) {
                <h3>{{ speedCurrent()?.question }}</h3>
              }
              <div class="speed-options">
                @for (option of speedCurrent()?.options ?? []; track option; let idx = $index) {
                  <button
                    class="speed-option"
                    [class.correct-flash]="speedFeedback() === 'correct' && idx === speedCurrent()?.correct"
                    [class.wrong-flash]="speedFeedback() === 'wrong' && idx === speedSelectedAnswer()"
                    (click)="answerSpeed(idx)"
                    [disabled]="speedFeedback() !== ''"
                    type="button"
                  >
                    {{ option }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Number Sequence Game -->
      @if (activeGame() === 'sequence') {
        <div class="game-panel">
          @if (!seqStarted()) {
            <div class="game-intro">
              <h2>Number Sequence</h2>
              <p>Click the numbers in ascending order as fast as you can!</p>
              <button class="game-start-btn" (click)="startSequence()" type="button">Start Game</button>
            </div>
          } @else if (seqWon()) {
            <div class="game-win">
              <h2>🎉 Complete!</h2>
              <p>Time: {{ seqTime() }}s</p>
              <button class="game-start-btn" (click)="startSequence()" type="button">Play Again</button>
            </div>
          } @else {
            <div class="game-stats">
              <span>Next: {{ seqNextNumber() }}</span>
              <span>Time: {{ seqTime() }}s</span>
            </div>
            <div class="seq-grid">
              @for (num of seqNumbers(); track num.value) {
                <button
                  class="seq-btn"
                  [class.clicked]="num.clicked"
                  (click)="clickSeqNumber(num.value)"
                  type="button"
                  [disabled]="num.clicked"
                >
                  {{ num.clicked ? '✓' : num.value }}
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .games-container {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .games-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      text-align: center;
      margin: 0 0 4px;
    }

    .games-subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin: 0 0 24px;
      font-size: 0.9375rem;
    }

    .game-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .game-tab {
      padding: 10px 20px;
      font-size: 0.875rem;
      font-weight: 600;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .game-tab.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: var(--primary-color-alpha);
    }

    .game-tab:hover:not(.active) {
      border-color: var(--text-secondary);
    }

    .game-panel {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 28px;
    }

    .game-intro, .game-win {
      text-align: center;
      padding: 24px;
    }

    .game-intro h2, .game-win h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .game-intro p, .game-win p {
      color: var(--text-secondary);
      margin: 0 0 20px;
      font-size: 0.9375rem;
    }

    .game-start-btn {
      padding: 14px 32px;
      font-size: 1rem;
      font-weight: 600;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .game-start-btn:hover { opacity: 0.9; }

    .game-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .speed-timer { color: var(--primary-color); }
    .speed-timer.urgent { color: #ef4444; }

    /* Memory Game */
    .memory-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .memory-card {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      cursor: pointer;
      transition: transform 0.3s, border-color 0.15s;
    }

    .memory-card:hover:not(:disabled) {
      border-color: var(--primary-color);
    }

    .memory-card.flipped {
      background: var(--primary-color-alpha);
      border-color: var(--primary-color);
      transform: rotateY(0);
    }

    .memory-card.matched {
      background: rgba(34, 197, 94, 0.1);
      border-color: #22c55e;
      cursor: default;
    }

    .card-emoji { font-size: 1.75rem; }
    .card-label { font-size: 0.6875rem; font-weight: 600; color: var(--text-secondary); }
    .card-back { font-size: 2rem; font-weight: 700; color: var(--text-secondary); opacity: 0.4; }

    /* Speed Quiz */
    .speed-question h3 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 16px;
      text-align: center;
    }

    .speed-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .speed-option {
      padding: 14px 18px;
      font-size: 0.9375rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .speed-option:hover:not(:disabled) {
      border-color: var(--primary-color);
      background: var(--bg-muted);
    }

    .speed-option.correct-flash {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.15);
    }

    .speed-option.wrong-flash {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.15);
    }

    /* Sequence Game */
    .seq-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    .seq-btn {
      aspect-ratio: 1;
      font-size: 1.5rem;
      font-weight: 700;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .seq-btn:hover:not(:disabled) {
      border-color: var(--primary-color);
      transform: scale(1.05);
    }

    .seq-btn.clicked {
      background: #22c55e;
      color: white;
      border-color: #22c55e;
    }

    @media (max-width: 480px) {
      .memory-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .seq-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .card-emoji { font-size: 1.25rem; }
      .seq-btn { font-size: 1.125rem; }
    }
  `],
})
export class GamesComponent {
  private readonly auth = inject(AuthService);
  private readonly progressService = inject(ProgressService);

  readonly activeGame = signal<GameType>('memory');

  // ── Memory Match State ──
  readonly memoryStarted = signal(false);
  readonly memoryCards = signal<MemoryCard[]>([]);
  readonly flippedCards = signal<number[]>([]);
  readonly memoryMoves = signal(0);
  readonly memoryTime = signal(0);
  readonly memoryWon = signal(false);
  private memoryTimer: ReturnType<typeof setInterval> | null = null;

  readonly matchedCount = computed(() => this.memoryCards().filter((c) => c.matched).length);

  // ── Speed Quiz State ──
  readonly speedStarted = signal(false);
  readonly speedFinished = signal(false);
  readonly speedScore = signal(0);
  readonly speedCorrect = signal(0);
  readonly speedWrong = signal(0);
  readonly speedTime = signal(60);
  readonly speedCurrent = signal<SpeedQuestion | null>(null);
  readonly speedFeedback = signal('');
  readonly speedSelectedAnswer = signal(-1);
  private speedTimer: ReturnType<typeof setInterval> | null = null;

  private readonly allSpeedQuestions: SpeedQuestion[] = [
    { question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correct: 1 },
    { question: 'What planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correct: 2 },
    { question: 'Which keyword defines a function in Python?', options: ['func', 'def', 'fn', 'function'], correct: 1 },
    { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
    { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correct: 1 },
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
    { question: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Austen', 'Hemingway'], correct: 1 },
    { question: 'What is √144?', options: ['10', '11', '12', '13'], correct: 2 },
    { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
    { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correct: 1 },
    { question: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'CO₂', 'Hydrogen'], correct: 2 },
    { question: 'What is 9²?', options: ['72', '81', '90', '99'], correct: 1 },
    { question: 'Which is a primary color?', options: ['Green', 'Orange', 'Red', 'Purple'], correct: 2 },
    { question: 'What is the capital of France?', options: ['Lyon', 'Nice', 'Paris', 'Bordeaux'], correct: 2 },
    { question: 'How many degrees in a right angle?', options: ['45', '90', '180', '360'], correct: 1 },
    { question: 'What language is Angular written in?', options: ['Java', 'TypeScript', 'Python', 'C++'], correct: 1 },
    { question: 'What is H₂O commonly known as?', options: ['Salt', 'Water', 'Acid', 'Sugar'], correct: 1 },
    { question: 'How many bones in the human body?', options: ['196', '206', '216', '226'], correct: 1 },
    { question: 'What is 3/4 as a decimal?', options: ['0.25', '0.5', '0.75', '1.25'], correct: 2 },
    { question: 'Which is the smallest prime number?', options: ['0', '1', '2', '3'], correct: 2 },
  ];

  // ── Sequence Game State ──
  readonly seqStarted = signal(false);
  readonly seqWon = signal(false);
  readonly seqTime = signal(0);
  readonly seqNumbers = signal<{ value: number; clicked: boolean }[]>([]);
  private seqTimer: ReturnType<typeof setInterval> | null = null;

  readonly seqNextNumber = computed(() => {
    const clicked = this.seqNumbers().filter((n) => n.clicked).length;
    return clicked + 1;
  });

  // ── Memory Match Logic ──
  startMemory(): void {
    const pairs: { label: string; emoji: string }[] = [
      { label: 'Math', emoji: '🔢' },
      { label: 'Science', emoji: '🔬' },
      { label: 'Programming', emoji: '💻' },
      { label: 'Languages', emoji: '🌍' },
      { label: 'History', emoji: '🏛️' },
      { label: 'Art', emoji: '🎨' },
      { label: 'Music', emoji: '🎵' },
      { label: 'Books', emoji: '📚' },
    ];

    const cards: MemoryCard[] = [];
    let id = 0;
    for (const pair of pairs) {
      cards.push({ id: id++, label: pair.label, emoji: pair.emoji, matched: false });
      cards.push({ id: id++, label: pair.label, emoji: pair.emoji, matched: false });
    }
    this.shuffle(cards);

    this.memoryCards.set(cards);
    this.flippedCards.set([]);
    this.memoryMoves.set(0);
    this.memoryTime.set(0);
    this.memoryStarted.set(true);
    this.memoryWon.set(false);

    if (this.memoryTimer) clearInterval(this.memoryTimer);
    this.memoryTimer = setInterval(() => {
      this.memoryTime.update((t) => t + 1);
    }, 1000);
  }

  flipCard(cardId: number): void {
    if (this.flippedCards().length >= 2) return;
    if (this.flippedCards().includes(cardId)) return;

    const newFlipped = [...this.flippedCards(), cardId];
    this.flippedCards.set(newFlipped);

    if (newFlipped.length === 2) {
      this.memoryMoves.update((m) => m + 1);
      const [a, b] = newFlipped;
      const cardA = this.memoryCards().find((c) => c.id === a);
      const cardB = this.memoryCards().find((c) => c.id === b);

      if (cardA && cardB && cardA.label === cardB.label) {
        setTimeout(() => {
          this.memoryCards.update((cards) =>
            cards.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          this.flippedCards.set([]);

          if (this.memoryCards().every((c) => c.matched)) {
            this.memoryWon.set(true);
            this.memoryStarted.set(false);
            if (this.memoryTimer) clearInterval(this.memoryTimer);
            this.awardGameBadge();
          }
        }, 500);
      } else {
        setTimeout(() => {
          this.flippedCards.set([]);
        }, 900);
      }
    }
  }

  // ── Speed Quiz Logic ──
  startSpeed(): void {
    this.speedStarted.set(true);
    this.speedFinished.set(false);
    this.speedScore.set(0);
    this.speedCorrect.set(0);
    this.speedWrong.set(0);
    this.speedTime.set(60);
    this.speedFeedback.set('');
    this.nextSpeedQuestion();

    if (this.speedTimer) clearInterval(this.speedTimer);
    this.speedTimer = setInterval(() => {
      this.speedTime.update((t) => {
        if (t <= 1) {
          this.finishSpeed();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  nextSpeedQuestion(): void {
    const random = this.allSpeedQuestions[Math.floor(Math.random() * this.allSpeedQuestions.length)];
    this.speedCurrent.set(random);
    this.speedFeedback.set('');
    this.speedSelectedAnswer.set(-1);
  }

  answerSpeed(idx: number): void {
    const current = this.speedCurrent();
    if (!current || this.speedFeedback()) return;

    this.speedSelectedAnswer.set(idx);

    if (idx === current.correct) {
      this.speedScore.update((s) => s + 10);
      this.speedCorrect.update((c) => c + 1);
      this.speedFeedback.set('correct');
    } else {
      this.speedWrong.update((w) => w + 1);
      this.speedFeedback.set('wrong');
    }

    setTimeout(() => {
      if (this.speedStarted()) {
        this.nextSpeedQuestion();
      }
    }, 600);
  }

  finishSpeed(): void {
    this.speedStarted.set(false);
    this.speedFinished.set(true);
    if (this.speedTimer) clearInterval(this.speedTimer);
    if (this.speedScore() >= 50) this.awardGameBadge();
  }

  // ── Number Sequence Logic ──
  startSequence(): void {
    const values = Array.from({ length: 20 }, (_, i) => i + 1);
    this.shuffle(values);
    this.seqNumbers.set(values.map((v) => ({ value: v, clicked: false })));
    this.seqStarted.set(true);
    this.seqWon.set(false);
    this.seqTime.set(0);

    if (this.seqTimer) clearInterval(this.seqTimer);
    this.seqTimer = setInterval(() => {
      this.seqTime.update((t) => t + 1);
    }, 1000);
  }

  clickSeqNumber(value: number): void {
    const expected = this.seqNextNumber();
    if (value !== expected) return;

    this.seqNumbers.update((nums) =>
      nums.map((n) => (n.value === value ? { ...n, clicked: true } : n))
    );

    if (this.seqNumbers().every((n) => n.clicked)) {
      this.seqWon.set(true);
      this.seqStarted.set(false);
      if (this.seqTimer) clearInterval(this.seqTimer);
      this.awardGameBadge();
    }
  }

  // ── Helpers ──
  private awardGameBadge(): void {
    if (this.auth.isAuthenticated()) {
      this.progressService.awardBadge('game_winner');
    }
  }

  private shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}
