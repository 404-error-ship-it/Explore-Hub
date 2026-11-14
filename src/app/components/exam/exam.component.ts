import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ProgressService } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';
import { Quiz, QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-exam',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="exam-container">
      @if (loading()) {
        <div class="exam-loading">Loading exam…</div>
      } @else if (!quiz()) {
        <div class="exam-not-found">
          <p>No exam available for this course.</p>
          <a routerLink="/" class="back-link">← Back to Gallery</a>
        </div>
      } @else if (result()) {
        <!-- Results View -->
        <div class="result-card">
          <div class="result-header">
            <div class="result-score-ring" [class.passed]="result()?.passed">
              <span class="score-pct">{{ result()?.percentage }}%</span>
            </div>
            <h1>
              @if (result()?.passed) { 🎉 Exam Passed! }
              @else { 📚 Keep Learning! }
            </h1>
            <p class="result-summary">
              You scored {{ result()?.score }} out of {{ result()?.totalQuestions }}
            </p>
          </div>

          <div class="result-actions">
            <a [routerLink]="['/exploration', courseId()]" class="action-btn secondary">Back to Course</a>
            <button class="action-btn primary" (click)="retakeExam()" type="button">Retake Exam</button>
            <a routerLink="/dashboard" class="action-btn tertiary">View Dashboard →</a>
          </div>

          <!-- Answer Review -->
          <div class="answer-review">
            <h2>Answer Review</h2>
            @for (answer of result()?.answers ?? []; track answer.questionId; let i = $index) {
              <div class="review-item" [class.correct]="answer.correct" [class.incorrect]="!answer.correct">
                <div class="review-question">
                  <span class="review-number">{{ i + 1 }}</span>
                  <span class="review-text">{{ getQuestionText(i) }}</span>
                </div>
                <div class="review-answer">
                  @if (answer.correct) {
                    <span class="answer-status correct">✓ Correct</span>
                  } @else {
                    <span class="answer-status incorrect">✗ Incorrect</span>
                  }
                  <div class="answer-detail">
                    <p class="your-answer">Your answer: {{ answer.selectedAnswer >= 0 ? getOptionText(i, answer.selectedAnswer) : 'No answer' }}</p>
                    @if (!answer.correct) {
                      <p class="correct-answer">Correct answer: {{ getCorrectAnswerText(i) }}</p>
                    }
                    <p class="explanation">{{ getExplanation(i) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- Quiz View -->
        <div class="quiz-header">
          <a [routerLink]="['/exploration', courseId()]" class="back-link">← Back to Course</a>
          <h1>{{ quiz()?.title }}</h1>
          <p class="quiz-desc">{{ quiz()?.description }}</p>
          <div class="quiz-progress">
            <span>Question {{ currentQuestion() + 1 }} of {{ quiz()?.questions.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="((currentQuestion() + 1) / (quiz()?.questions.length ?? 1)) * 100"></div>
            </div>
          </div>
        </div>

        @if (currentQuestion() < totalQuestionCount()) {
          <div class="question-card">
            <h2 class="question-text">{{ getCurrentQuestion()?.question }}</h2>
            <div class="options-list">
              @for (option of getCurrentQuestion()?.options ?? []; track option; let idx = $index) {
                <button
                  class="option-btn"
                  [class.selected]="answers()[getCurrentQuestionId()] === idx"
                  (click)="selectAnswer(getCurrentQuestionId(), idx)"
                  type="button"
                >
                  <span class="option-letter">{{ getOptionLetter(idx) }}</span>
                  <span class="option-text">{{ option }}</span>
                </button>
              }
            </div>
          </div>

          <div class="quiz-nav">
            @if (currentQuestion() > 0) {
              <button class="nav-btn secondary" (click)="prevQuestion()" type="button">← Previous</button>
            } @else {
              <span></span>
            }

            @if (currentQuestion() < totalQuestionCount() - 1) {
              <button
                class="nav-btn primary"
                (click)="nextQuestion()"
                [disabled]="answers()[getCurrentQuestionId()] === undefined"
                type="button"
              >
                Next →
              </button>
            } @else {
              <button
                class="nav-btn submit"
                (click)="submitExam()"
                [disabled]="!allAnswered()"
                type="button"
              >
                Submit Exam
              </button>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .exam-container {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .exam-loading, .exam-not-found {
      text-align: center;
      padding: 80px 16px;
      color: var(--text-secondary);
      font-size: 1.125rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-color);
      text-decoration: none;
    }

    .back-link:hover { opacity: 0.8; }

    /* Quiz Header */
    .quiz-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    .quiz-desc {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0 0 16px;
    }

    .quiz-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .quiz-progress span {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      white-space: nowrap;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    /* Question Card */
    .question-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 20px;
    }

    .question-text {
      font-size: 1.1875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      text-align: left;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: border-color 0.15s, background-color 0.15s;
    }

    .option-btn:hover {
      border-color: var(--text-secondary);
      background: var(--bg-muted);
    }

    .option-btn.selected {
      border-color: var(--primary-color);
      background: var(--primary-color-alpha);
    }

    .option-letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      font-size: 0.875rem;
      font-weight: 700;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .option-btn.selected .option-letter {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .option-text {
      font-size: 0.9375rem;
    }

    /* Quiz Navigation */
    .quiz-nav {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .nav-btn {
      padding: 12px 24px;
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.15s;
      border: none;
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-btn.secondary {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .nav-btn.primary, .nav-btn.submit {
      background: var(--primary-color);
      color: white;
    }

    .nav-btn.submit {
      background: #22c55e;
    }

    .nav-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    /* Results */
    .result-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 32px;
    }

    .result-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .result-score-ring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 5px solid #ef4444;
      margin-bottom: 16px;
    }

    .result-score-ring.passed {
      border-color: #22c55e;
    }

    .score-pct {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .result-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--text-primary);
    }

    .result-summary {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .result-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }

    .action-btn {
      padding: 10px 20px;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 10px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }

    .action-btn:hover { opacity: 0.9; }

    .action-btn.primary {
      background: var(--primary-color);
      color: white;
    }

    .action-btn.secondary {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .action-btn.tertiary {
      background: none;
      color: var(--primary-color);
    }

    /* Answer Review */
    .answer-review h2 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 16px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .review-item {
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      border: 1px solid var(--border-color);
    }

    .review-item.correct {
      background: rgba(34, 197, 94, 0.05);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .review-item.incorrect {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .review-question {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .review-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 50%;
      background: var(--bg-muted);
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .review-text {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .answer-status {
      font-size: 0.8125rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .answer-status.correct { color: #22c55e; }
    .answer-status.incorrect { color: #ef4444; }

    .answer-detail p {
      font-size: 0.875rem;
      margin: 4px 0;
    }

    .your-answer { color: var(--text-secondary); }
    .correct-answer { color: #22c55e; font-weight: 600; }
    .explanation {
      color: var(--text-secondary);
      font-style: italic;
      padding-top: 4px;
      border-top: 1px dashed var(--border-color);
      margin-top: 6px;
    }

    @media (max-width: 640px) {
      .result-actions { flex-direction: column; }
      .action-btn { width: 100%; text-align: center; }
    }
  `],
})
export class ExamComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);
  private readonly progressService = inject(ProgressService);
  private readonly authService = inject(AuthService);

  readonly courseId = signal('');
  readonly loading = signal(true);
  readonly quiz = signal<Quiz | null>(null);
  readonly currentQuestion = signal(0);
  readonly answers = signal<Record<string, number>>({});
  readonly result = signal<QuizResult | null>(null);

  readonly allAnswered = computed(() => {
    const q = this.quiz();
    if (!q) return false;
    return q.questions.every((question) => this.answers()[question.id] !== undefined);
  });

  totalQuestionCount(): number {
    return this.quiz()?.questions.length ?? 0;
  }

  getCurrentQuestion() {
    return this.quiz()?.questions[this.currentQuestion()];
  }

  getCurrentQuestionId(): string {
    return this.quiz()?.questions[this.currentQuestion()].id ?? '';
  }

  getOptionLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }

  getQuestionText(index: number): string {
    return this.quiz()?.questions[index]?.question ?? '';
  }

  getOptionText(qIndex: number, oIndex: number): string {
    return this.quiz()?.questions[qIndex]?.options[oIndex] ?? '';
  }

  getCorrectAnswerText(qIndex: number): string {
    const q = this.quiz()?.questions[qIndex];
    if (!q) return '';
    return q.options[q.correctAnswer] ?? '';
  }

  getExplanation(index: number): string {
    return this.quiz()?.questions[index]?.explanation ?? '';
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.courseId.set(id);
      const quiz = this.quizService.getQuiz(id);
      this.quiz.set(quiz);
      this.loading.set(false);
    });
  }

  selectAnswer(questionId: string, optionIndex: number): void {
    this.answers.update((a) => ({ ...a, [questionId]: optionIndex }));
  }

  nextQuestion(): void {
    this.currentQuestion.update((n) => n + 1);
  }

  prevQuestion(): void {
    this.currentQuestion.update((n) => Math.max(0, n - 1));
  }

  submitExam(): void {
    const quiz = this.quiz();
    const user = this.authService.currentUser();
    if (!quiz || !user) return;

    const quizResult = this.quizService.evaluate(
      this.courseId(),
      user.id,
      quiz,
      { answers: this.answers() }
    );

    this.progressService.recordQuizResult(
      this.courseId(),
      quizResult.score,
      quizResult.totalQuestions,
      quizResult.percentage,
      quizResult.passed
    );

    this.result.set(quizResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retakeExam(): void {
    this.result.set(null);
    this.answers.set({});
    this.currentQuestion.set(0);
  }
}
