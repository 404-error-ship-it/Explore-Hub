export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: string[];
  readonly correctAnswer: number;
  readonly explanation: string;
}

export interface Quiz {
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly questions: QuizQuestion[];
  readonly passingScore: number;
}

export interface QuizSubmission {
  readonly answers: Record<string, number>;
}

export interface QuizResult {
  readonly quizId: string;
  readonly courseId: string;
  readonly userId: string;
  readonly score: number;
  readonly totalQuestions: number;
  readonly percentage: number;
  readonly passed: boolean;
  readonly answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
  readonly completedAt: string;
}

export interface Lesson {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly content: string;
  readonly keyPoints: readonly string[];
  readonly durationMinutes: number;
  readonly order: number;
}
