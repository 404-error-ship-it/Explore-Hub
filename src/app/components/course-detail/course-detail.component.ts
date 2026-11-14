import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ExplorationService } from '../../services/exploration.service';
import { ProgressService } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';
import { getLessonsForCourse, hasLessons } from '../../data/lesson-data';
import { hasQuiz } from '../../data/quiz-data';
import { Lesson } from '../../models/quiz.model';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-container">
      @if (loading()) {
        <div class="detail-loading">Loading course…</div>
      } @else if (!course()) {
        <div class="detail-not-found">
          <p>Course not found.</p>
          <a routerLink="/" class="back-link">← Back to Gallery</a>
        </div>
      } @else {
        <!-- Course Header -->
        <div class="course-header" [ngClass]="subjectClass()">
          <a routerLink="/" class="back-link">← Back to Gallery</a>
          <div class="course-header-content">
            <div class="course-header-left">
              <div class="course-banner">
                <span class="course-banner-emoji">{{ subjectEmoji() }}</span>
                <span class="course-subject-badge">{{ course()?.subject }}</span>
              </div>
              <h1>{{ course()?.title }}</h1>
              <p class="course-description">{{ course()?.description || 'No description available.' }}</p>
              <div class="course-meta">
                <span class="meta-item" [attr.data-level]="course()?.difficulty">{{ course()?.difficulty }}</span>
                <span class="meta-item">{{ course()?.language }}</span>
                <span class="meta-item">{{ course()?.durationMinutes }} min</span>
                <span class="meta-item">★ {{ course()?.rating.toFixed(1) }}</span>
                <span class="meta-item">By {{ course()?.author }}</span>
              </div>
            </div>
            <div class="course-header-right">
              @if (progressPct() > 0) {
                <div class="progress-ring">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-color)" stroke-width="6"/>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary-color)" stroke-width="6"
                      stroke-dasharray="213.6" [attr.stroke-dashoffset]="213.6 - (213.6 * progressPct() / 100)"
                      stroke-linecap="round" transform="rotate(-90 40 40)"/>
                  </svg>
                  <span class="progress-pct">{{ progressPct() }}%</span>
                </div>
              }
            </div>
          </div>
        </div>

        @if (!isAuthenticated()) {
          <div class="auth-prompt">
            <p>📋 <a routerLink="/login">Log in</a> to track your progress and take the exam.</p>
          </div>
        }

        <!-- Lessons Section -->
        <section class="lessons-section">
          <h2>Course Content</h2>
          @if (lessons().length > 0) {
            <p class="section-subtitle">{{ lessons().length }} lessons · {{ totalDuration() }} min total</p>
            <div class="lessons-list">
              @for (lesson of lessons(); track lesson.id) {
                <div class="lesson-card" [class.completed]="isLessonDone(lesson.id)">
                  <div class="lesson-header" (click)="toggleLesson(lesson.id)">
                    <span class="lesson-check">
                      @if (isLessonDone(lesson.id)) {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="18" height="18">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span class="lesson-number">{{ lesson.order }}</span>
                      }
                    </span>
                    <div class="lesson-info">
                      <h3>{{ lesson.title }}</h3>
                      <span class="lesson-duration">{{ lesson.durationMinutes }} min</span>
                    </div>
                    <span class="lesson-chevron" [class.expanded]="expandedLesson() === lesson.id">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>

                  @if (expandedLesson() === lesson.id) {
                    <div class="lesson-body">
                      <p class="lesson-content">{{ lesson.content }}</p>
                      @if (lesson.keyPoints.length > 0) {
                        <div class="key-points">
                          <h4>Key Points</h4>
                          <ul>
                            @for (point of lesson.keyPoints; track point) {
                              <li>{{ point }}</li>
                            }
                          </ul>
                        </div>
                      }
                      @if (isAuthenticated()) {
                        <button
                          class="lesson-complete-btn"
                          (click)="completeLesson(lesson)"
                          [disabled]="isLessonDone(lesson.id)"
                          type="button"
                        >
                          @if (isLessonDone(lesson.id)) {
                            ✓ Completed
                          } @else {
                            Mark as Complete
                          }
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="no-lessons">
              <p>Full lesson content for this course is coming soon. Check back shortly!</p>
            </div>
          }
        </section>

        <!-- Exam Section -->
        @if (quizAvailable()) {
          <section class="exam-section">
            <h2>Final Exam</h2>
            <div class="exam-card">
              <div class="exam-info">
                <h3>Test Your Knowledge</h3>
                <p>Complete this quiz to test what you've learned. You need 60% to pass.</p>
                @if (courseProgress()?.quizCompleted) {
                  <div class="exam-result-badge" [class.passed]="courseProgress()?.quizPercentage! >= 60">
                    @if (courseProgress()?.quizPercentage! >= 60) {
                      ✓ Passed with {{ courseProgress()?.quizPercentage }}%
                    } @else {
                      Last attempt: {{ courseProgress()?.quizPercentage }}% — Try again!
                    }
                  </div>
                }
              </div>
              @if (isAuthenticated()) {
                <a [routerLink]="['/exploration', courseId(), 'exam']" class="exam-start-btn">
                  {{ courseProgress()?.quizCompleted ? 'Retake Exam' : 'Start Exam' }} →
                </a>
              } @else {
                <a routerLink="/login" class="exam-start-btn">Log in to take exam →</a>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .detail-loading, .detail-not-found {
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
      transition: opacity 0.15s;
    }

    .back-link:hover {
      opacity: 0.8;
    }

    .course-header {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .course-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 28px;
      background: var(--subject-bg, var(--primary-color-light));
    }

    .course-banner-emoji {
      font-size: 2.5rem;
    }

    .course-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding: 24px 28px;
    }

    .course-subject-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .course-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px;
      line-height: 1.3;
    }

    .course-description {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 16px;
    }

    .course-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .meta-item {
      font-size: 0.8125rem;
      padding: 4px 12px;
      background: var(--bg-muted);
      color: var(--text-secondary);
      border-radius: 20px;
    }

    .meta-item[data-level="Beginner"] { color: #166534; background: #dcfce7; }
    .meta-item[data-level="Intermediate"] { color: #92400e; background: #fef3c7; }
    .meta-item[data-level="Advanced"] { color: #991b1b; background: #fee2e2; }

    :host-context([data-theme="dark"]) .meta-item[data-level="Beginner"] { color: #86efac; background: #14532d; }
    :host-context([data-theme="dark"]) .meta-item[data-level="Intermediate"] { color: #fde68a; background: #78350f; }
    :host-context([data-theme="dark"]) .meta-item[data-level="Advanced"] { color: #fca5a5; background: #7f1d1d; }

    .progress-ring {
      position: relative;
      flex-shrink: 0;
    }

    .progress-pct {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .auth-prompt {
      background: var(--primary-color-alpha);
      border: 1px solid var(--primary-color);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-size: 0.9375rem;
    }

    .auth-prompt a {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    .auth-prompt a:hover {
      text-decoration: underline;
    }

    .lessons-section, .exam-section {
      margin-bottom: 32px;
    }

    .lessons-section h2, .exam-section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 16px;
    }

    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .lesson-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      overflow: hidden;
      transition: border-color 0.15s;
    }

    .lesson-card.completed {
      border-color: #22c55e;
    }

    :host-context([data-theme="dark"]) .lesson-card.completed {
      border-color: #166534;
    }

    .lesson-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .lesson-header:hover {
      background: var(--bg-muted);
    }

    .lesson-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--border-color);
      flex-shrink: 0;
      color: #22c55e;
    }

    .lesson-card.completed .lesson-check {
      background: #22c55e;
      border-color: #22c55e;
      color: white;
    }

    .lesson-number {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .lesson-info {
      flex: 1;
    }

    .lesson-info h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 2px;
    }

    .lesson-duration {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .lesson-chevron {
      color: var(--text-secondary);
      transition: transform 0.2s;
      flex-shrink: 0;
    }

    .lesson-chevron.expanded {
      transform: rotate(180deg);
    }

    .lesson-body {
      padding: 0 20px 20px 66px;
    }

    .lesson-content {
      font-size: 0.9375rem;
      color: var(--text-primary);
      line-height: 1.7;
      margin: 0 0 16px;
    }

    .key-points {
      background: var(--bg-muted);
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 16px;
    }

    .key-points h4 {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin: 0 0 8px;
    }

    .key-points ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .key-points li {
      font-size: 0.875rem;
      color: var(--text-primary);
      padding: 4px 0 4px 20px;
      position: relative;
    }

    .key-points li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--primary-color);
      font-weight: 700;
    }

    .lesson-complete-btn {
      padding: 10px 20px;
      font-size: 0.875rem;
      font-weight: 600;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .lesson-complete-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .lesson-complete-btn:disabled {
      background: #22c55e;
      cursor: default;
      opacity: 1;
    }

    .no-lessons {
      background: var(--bg-muted);
      border-radius: 14px;
      padding: 32px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .exam-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 20px 24px;
      margin-top: 12px;
    }

    .exam-info h3 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    .exam-info p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .exam-result-badge {
      display: inline-block;
      margin-top: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      background: #fee2e2;
      color: #991b1b;
    }

    .exam-result-badge.passed {
      background: #dcfce7;
      color: #166534;
    }

    :host-context([data-theme="dark"]) .exam-result-badge {
      background: #7f1d1d;
      color: #fca5a5;
    }

    :host-context([data-theme="dark"]) .exam-result-badge.passed {
      background: #14532d;
      color: #86efac;
    }

    .exam-start-btn {
      padding: 12px 24px;
      font-size: 0.9375rem;
      font-weight: 600;
      background: var(--primary-color);
      color: white;
      border-radius: 10px;
      text-decoration: none;
      white-space: nowrap;
      transition: opacity 0.15s;
    }

    .exam-start-btn:hover {
      opacity: 0.9;
    }

    @media (max-width: 640px) {
      .course-header-content { flex-direction: column; }
      .course-header-right { align-self: flex-end; }
      .exam-card { flex-direction: column; align-items: stretch; }
      .exam-start-btn { text-align: center; }
    }
  `],
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly explorationService = inject(ExplorationService);
  private readonly progressService = inject(ProgressService);
  private readonly authService = inject(AuthService);

  readonly courseId = signal('');
  readonly loading = signal(true);
  readonly course = signal<ReturnType<ExplorationService['getById']> | null>(null);
  readonly lessons = signal<Lesson[]>([]);
  readonly quizAvailable = signal(false);
  readonly expandedLesson = signal<string | null>(null);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly courseProgress = computed(() =>
    this.courseId() ? this.progressService.getCourseProgress(this.courseId()) : null
  );
  readonly progressPct = computed(() => this.courseProgress()?.progressPercentage ?? 0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.courseId.set(id);
      this.course.set(this.explorationService.getById(id));
      this.lessons.set(getLessonsForCourse(id));
      this.quizAvailable.set(hasQuiz(id));
      this.loading.set(false);

      if (this.authService.isAuthenticated()) {
        this.progressService.startCourse(id);
        this.progressService.loadProgress();
      }
    });
  }

  totalDuration(): number {
    return this.lessons().reduce((sum, l) => sum + l.durationMinutes, 0);
  }

  subjectClass(): string {
    const subject = this.course()?.subject ?? '';
    return `subject-${subject.toLowerCase()}`;
  }

  subjectEmoji(): string {
    const emojis: Record<string, string> = {
      Mathematics: '🔢',
      Science: '🔬',
      Programming: '💻',
      Languages: '🌍',
      History: '🏛️',
      Art: '🎨',
    };
    return emojis[this.course()?.subject ?? ''] ?? '📚';
  }

  isLessonDone(lessonId: string): boolean {
    return this.progressService.isLessonCompleted(this.courseId(), lessonId);
  }

  toggleLesson(lessonId: string): void {
    this.expandedLesson.set(this.expandedLesson() === lessonId ? null : lessonId);
  }

  completeLesson(lesson: Lesson): void {
    this.progressService.completeLesson(this.courseId(), lesson.id);
    this.expandedLesson.set(null);
  }
}
