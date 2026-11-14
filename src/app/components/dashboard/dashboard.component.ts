import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { ExplorationService } from '../../services/exploration.service';
import { ACHIEVEMENT_BADGES } from '../../models/progress.model';
import { CourseProgress } from '../../models/progress.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <!-- Welcome -->
      <div class="welcome-section">
        <div class="welcome-avatar">{{ user()?.avatar }}</div>
        <div>
          <h1>Welcome back, {{ user()?.name }}!</h1>
          <p>Track your learning journey and keep up the great work.</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats()?.coursesStarted ?? 0 }}</div>
          <div class="stat-label">Courses Started</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats()?.coursesCompleted ?? 0 }}</div>
          <div class="stat-label">Courses Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats()?.totalLessonsCompleted ?? 0 }}</div>
          <div class="stat-label">Lessons Done</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.895 19 21l-4.118-2.078L12 21l-2.882-2.078L5 21l3.523-8.105"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats()?.totalQuizzesTaken ?? 0 }}</div>
          <div class="stat-label">Quizzes Taken</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats()?.averageQuizScore ?? 0 }}%</div>
          <div class="stat-label">Avg Quiz Score</div>
        </div>
      </div>

      <!-- Badges -->
      @if (badges().length > 0) {
        <section class="badges-section">
          <h2>🏆 Achievements</h2>
          <div class="badges-grid">
            @for (badge of badges(); track badge) {
              <div class="badge-card">
                <span class="badge-emoji">
                  @switch (badge) {
                    @case ('first_course') { 🎯 }
                    @case ('first_quiz') { 📝 }
                    @case ('perfect_score') { ⭐ }
                    @case ('five_courses') { 🗺️ }
                    @case ('ten_lessons') { 📚 }
                    @case ('game_winner') { 🎮 }
                    @default { 🏅 }
                  }
                </span>
                <span class="badge-text">{{ badgeLabels[badge] ?? badge }}</span>
              </div>
            }
          </div>
        </section>
      }

      <!-- In-Progress Courses -->
      @if (inProgressCourses().length > 0) {
        <section class="courses-section">
          <h2>📖 Your Courses</h2>
          <div class="course-list">
            @for (cp of inProgressCourses(); track cp.courseId) {
              <a [routerLink]="['/exploration', cp.courseId]" class="course-progress-card">
                <div class="course-card-top">
                  <h3>{{ getCourseTitle(cp.courseId) }}</h3>
                  <span class="course-progress-pct">{{ cp.progressPercentage }}%</span>
                </div>
                <div class="course-progress-bar">
                  <div class="course-progress-fill" [style.width.%]="cp.progressPercentage"></div>
                </div>
                <div class="course-progress-meta">
                  <span>{{ cp.lessonsCompleted.length }} lessons done</span>
                  @if (cp.quizCompleted) {
                    <span [class.passed]="cp.quizPercentage >= 60">Quiz: {{ cp.quizPercentage }}%</span>
                  } @else {
                    <span>Quiz not taken</span>
                  }
                </div>
              </a>
            }
          </div>
        </section>
      } @else {
        <section class="empty-dashboard">
          <div class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h2>Start Your Learning Journey</h2>
          <p>You haven't started any courses yet. Explore the gallery and dive in!</p>
          <a routerLink="/" class="start-btn">Browse Courses →</a>
        </section>
      }

      <!-- Quick Actions -->
      <section class="quick-actions">
        <a routerLink="/" class="action-card">
          <span class="action-icon">📚</span>
          <span class="action-text">Browse Courses</span>
        </a>
        <a routerLink="/games" class="action-card">
          <span class="action-icon">🎮</span>
          <span class="action-text">Play Games</span>
        </a>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .welcome-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .welcome-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .welcome-section h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 2px;
    }

    .welcome-section p {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 18px;
      text-align: center;
    }

    .stat-card.highlight {
      border-color: var(--primary-color);
      background: var(--primary-color-alpha);
    }

    .stat-icon {
      color: var(--primary-color);
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .badges-section, .courses-section, .quick-actions {
      margin-bottom: 28px;
    }

    .badges-section h2, .courses-section h2 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    .badges-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .badge-card {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 10px 14px;
    }

    .badge-emoji {
      font-size: 1.25rem;
    }

    .badge-text {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .course-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .course-progress-card {
      display: block;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 18px;
      text-decoration: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .course-progress-card:hover {
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    .course-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .course-card-top h3 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .course-progress-pct {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .course-progress-bar {
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .course-progress-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .course-progress-meta {
      display: flex;
      gap: 12px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .course-progress-meta .passed { color: #22c55e; font-weight: 600; }

    .empty-dashboard {
      text-align: center;
      padding: 48px 24px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
    }

    .empty-icon {
      color: var(--text-secondary);
      opacity: 0.5;
      margin-bottom: 12px;
    }

    .empty-dashboard h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .empty-dashboard p {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0 0 20px;
    }

    .start-btn {
      display: inline-block;
      padding: 12px 28px;
      font-size: 0.9375rem;
      font-weight: 600;
      background: var(--primary-color);
      color: white;
      border-radius: 10px;
      text-decoration: none;
      transition: opacity 0.15s;
    }

    .start-btn:hover { opacity: 0.9; }

    .quick-actions {
      display: flex;
      gap: 12px;
    }

    .action-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      text-decoration: none;
      transition: border-color 0.15s, background-color 0.15s;
    }

    .action-card:hover {
      border-color: var(--primary-color);
      background: var(--bg-muted);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .quick-actions { flex-direction: column; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly progressService = inject(ProgressService);
  private readonly explorationService = inject(ExplorationService);

  readonly user = this.auth.currentUser;
  readonly stats = this.progressService.dashboardStats;
  readonly badgeLabels = ACHIEVEMENT_BADGES;

  readonly badges = computed(() => this.stats()?.badges ?? []);
  readonly inProgressCourses = computed<CourseProgress[]>(() => {
    const p = this.progressService.userProgress();
    return p?.courses ?? [];
  });

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.progressService.loadProgress();
  }

  getCourseTitle(courseId: string): string {
    return this.explorationService.getById(courseId)?.title ?? courseId;
  }
}
