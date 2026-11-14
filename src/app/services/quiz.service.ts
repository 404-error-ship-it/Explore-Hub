/**
 * @fileoverview Service for fetching quiz data and evaluating submissions.
 */

import { Injectable } from '@angular/core';
import { Quiz, QuizResult, QuizSubmission } from '../models/quiz.model';
import { getQuizForCourse } from '../data/quiz-data';

@Injectable({ providedIn: 'root' })
export class QuizService {
  getQuiz(courseId: string): Quiz | null {
    return getQuizForCourse(courseId);
  }

  evaluate(courseId: string, userId: string, quiz: Quiz, submission: QuizSubmission): QuizResult {
    const answers = quiz.questions.map((q) => {
      const selected = submission.answers[q.id] ?? -1;
      const correct = selected === q.correctAnswer;
      return { questionId: q.id, selectedAnswer: selected, correct };
    });

    const score = answers.filter((a) => a.correct).length;
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= quiz.passingScore;

    return {
      quizId: quiz.courseId,
      courseId,
      userId,
      score,
      totalQuestions: total,
      percentage,
      passed,
      answers,
      completedAt: new Date().toISOString(),
    };
  }
}
