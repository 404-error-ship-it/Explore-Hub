export interface CourseProgress {
  readonly courseId: string;
  readonly lessonsCompleted: readonly string[];
  readonly quizCompleted: boolean;
  readonly quizScore: number;
  readonly quizPercentage: number;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly progressPercentage: number;
}

export interface UserProgress {
  readonly userId: string;
  readonly courses: CourseProgress[];
  readonly totalQuizzesTaken: number;
  readonly averageQuizScore: number;
  readonly badges: readonly string[];
  readonly streak: number;
  readonly lastActivity: string;
}

export interface DashboardStats {
  readonly coursesStarted: number;
  readonly coursesCompleted: number;
  readonly totalLessonsCompleted: number;
  readonly totalQuizzesTaken: number;
  readonly averageQuizScore: number;
  readonly badges: readonly string[];
}

export const ACHIEVEMENT_BADGES: Record<string, string> = {
  first_course: 'First Steps — Started your first course',
  first_quiz: 'Quiz Master — Completed your first quiz',
  perfect_score: 'Perfectionist — Scored 100% on a quiz',
  five_courses: 'Explorer — Started 5 courses',
  ten_lessons: 'Scholar — Completed 10 lessons',
  game_winner: 'Game On — Won a game',
};
