/**
 * @fileoverview Tracks user progress through courses and quizzes using
 * localStorage. Provides computed dashboard statistics.
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { CourseProgress, UserProgress, DashboardStats } from '../models/progress.model';
import { AuthService } from './auth.service';
import { LESSONS } from '../data/lesson-data';

const PROGRESS_KEY = 'eg_user_progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly authService = inject(AuthService);

  readonly userProgress = signal<UserProgress | null>(null);

  readonly dashboardStats = computed<DashboardStats>(() => {
    const p = this.userProgress();
    if (!p) {
      return {
        coursesStarted: 0,
        coursesCompleted: 0,
        totalLessonsCompleted: 0,
        totalQuizzesTaken: 0,
        averageQuizScore: 0,
        badges: [],
      };
    }

    const coursesCompleted = p.courses.filter(
      (c) => c.progressPercentage >= 100 || (c.quizCompleted && c.quizPercentage >= 60)
    ).length;

    const totalLessons = p.courses.reduce(
      (sum, c) => sum + c.lessonsCompleted.length,
      0
    );

    return {
      coursesStarted: p.courses.length,
      coursesCompleted,
      totalLessonsCompleted: totalLessons,
      totalQuizzesTaken: p.totalQuizzesTaken,
      averageQuizScore: Math.round(p.averageQuizScore),
      badges: [...p.badges],
    };
  });

  constructor() {
    this.loadProgress();
  }

  loadProgress(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.userProgress.set(null);
      return;
    }
    try {
      const all = this.getAllProgress();
      const userProg = all.find((p) => p.userId === user.id);
      this.userProgress.set(userProg ?? null);
    } catch {
      this.userProgress.set(null);
    }
  }

  startCourse(courseId: string): void {
    const user = this.authService.currentUser();
    if (!user) return;

    let progress = this.userProgress();
    if (!progress) {
      progress = this.createEmptyProgress(user.id);
    }

    if (!progress.courses.find((c) => c.courseId === courseId)) {
      const courseProg: CourseProgress = {
        courseId,
        lessonsCompleted: [],
        quizCompleted: false,
        quizScore: 0,
        quizPercentage: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        progressPercentage: 0,
      };
      progress = { ...progress, courses: [...progress.courses, courseProg] };
      this.saveProgress(progress);
    }
  }

  completeLesson(courseId: string, lessonId: string): void {
    const user = this.authService.currentUser();
    if (!user) return;

    let progress = this.userProgress();
    if (!progress) {
      progress = this.createEmptyProgress(user.id);
    }

    const courses = progress.courses.map((c) => {
      if (c.courseId === courseId) {
        if (c.lessonsCompleted.includes(lessonId)) return c;
        const lessonsCompleted = [...c.lessonsCompleted, lessonId];
        const totalLessons = LESSONS.filter((l) => l.courseId === courseId).length;
        const lessonPct = totalLessons > 0 ? (lessonsCompleted.length / totalLessons) * 100 : 0;
        const quizPct = c.quizCompleted ? 100 : 0;
        const overallPct = Math.round((lessonPct * 0.5 + quizPct * 0.5));
        return {
          ...c,
          lessonsCompleted,
          progressPercentage: overallPct,
          completedAt: overallPct >= 100 ? new Date().toISOString() : c.completedAt,
        };
      }
      return c;
    });

    progress = { ...progress, courses, lastActivity: new Date().toISOString() };
    progress = this.addBadge(progress, 'ten_lessons', progress.courses.reduce((s, c) => s + c.lessonsCompleted.length, 0) >= 10);
    this.saveProgress(progress);
  }

  recordQuizResult(courseId: string, score: number, totalQuestions: number, percentage: number, passed: boolean): void {
    const user = this.authService.currentUser();
    if (!user) return;

    let progress = this.userProgress();
    if (!progress) {
      progress = this.createEmptyProgress(user.id);
    }

    const courses = progress.courses.map((c) => {
      if (c.courseId === courseId) {
        const totalLessons = LESSONS.filter((l) => l.courseId === courseId).length;
        const lessonPct = totalLessons > 0 ? (c.lessonsCompleted.length / totalLessons) * 100 : 0;
        const quizPct = passed ? 100 : 0;
        const overallPct = Math.round(lessonPct * 0.5 + quizPct * 0.5);
        return {
          ...c,
          quizCompleted: true,
          quizScore: score,
          quizPercentage: percentage,
          progressPercentage: overallPct,
          completedAt: overallPct >= 100 ? new Date().toISOString() : c.completedAt,
        };
      }
      return c;
    });

    const totalQuizzes = progress.totalQuizzesTaken + 1;
    const avgScore = Math.round((progress.averageQuizScore * progress.totalQuizzesTaken + percentage) / totalQuizzes);

    progress = {
      ...progress,
      courses,
      totalQuizzesTaken: totalQuizzes,
      averageQuizScore: avgScore,
      lastActivity: new Date().toISOString(),
    };

    // Award badges
    progress = this.addBadge(progress, 'first_quiz', true);
    progress = this.addBadge(progress, 'perfect_score', percentage === 100);
    progress = this.addBadge(progress, 'five_courses', progress.courses.length >= 5);

    this.saveProgress(progress);
  }

  awardBadge(badge: string): void {
    const user = this.authService.currentUser();
    if (!user) return;
    const progress = this.userProgress();
    if (!progress) return;
    const updated = this.addBadge(progress, badge, true);
    this.saveProgress(updated);
  }

  getCourseProgress(courseId: string): CourseProgress | null {
    const progress = this.userProgress();
    if (!progress) return null;
    return progress.courses.find((c) => c.courseId === courseId) ?? null;
  }

  isLessonCompleted(courseId: string, lessonId: string): boolean {
    const cp = this.getCourseProgress(courseId);
    return cp?.lessonsCompleted.includes(lessonId) ?? false;
  }

  private createEmptyProgress(userId: string): UserProgress {
    return {
      userId,
      courses: [],
      totalQuizzesTaken: 0,
      averageQuizScore: 0,
      badges: [],
      streak: 1,
      lastActivity: new Date().toISOString(),
    };
  }

  private addBadge(progress: UserProgress, badge: string, condition: boolean): UserProgress {
    if (condition && !progress.badges.includes(badge)) {
      return { ...progress, badges: [...progress.badges, badge] };
    }
    return progress;
  }

  private saveProgress(progress: UserProgress): void {
    this.userProgress.set(progress);
    try {
      const all = this.getAllProgress();
      const idx = all.findIndex((p) => p.userId === progress.userId);
      if (idx >= 0) {
        all[idx] = progress;
      } else {
        all.push(progress);
      }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    } catch {
      // ignore storage errors
    }
  }

  private getAllProgress(): UserProgress[] {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
