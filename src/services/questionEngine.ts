
/**
 * QuestionEngine Service
 * Handles validation and scoring for 10+ IELTS question types.
 */
export class QuestionEngine {
  /**
   * Validates student answers against correct answers based on question type.
   */
  static scoreQuestion(questionType: string, studentAnswers: any, correctAnswers: any): number {
    if (!studentAnswers || !correctAnswers) return 0;
    let score = 0;

    // Handle case where correctAnswers is a string (simple comparison)
    if (typeof correctAnswers === 'string') {
      if (studentAnswers.toString().trim().toLowerCase() === correctAnswers.trim().toLowerCase()) {
        return 1;
      }
      return 0;
    }

    // Handle case where correctAnswers is an object (multiple sub-questions)
    if (typeof correctAnswers === 'object' && correctAnswers !== null) {
      Object.keys(correctAnswers).forEach((key) => {
        const studentVal = studentAnswers[key]?.toString().trim().toLowerCase();
        const correctVal = correctAnswers[key]?.toString().trim().toLowerCase();
        if (studentVal === correctVal) {
          score += 1;
        }
      });
      return score;
    }

    return 0;
  }

  /**
   * Calculates the total score for a test result.
   */
  static calculateTotalScore(questions: any[], studentAnswers: any): number {
    let totalScore = 0;
    questions.forEach((q) => {
      const qAnswers = studentAnswers[q.id];
      if (qAnswers) {
        totalScore += this.scoreQuestion(q.type, qAnswers, q.correctAnswers);
      }
    });
    return totalScore;
  }

  /**
   * Maps raw score to IELTS Band Score (Simplified mapping)
   */
  static mapToBandScore(rawScore: number, totalQuestions: number): number {
    const percentage = (rawScore / totalQuestions) * 100;
    if (percentage >= 90) return 9.0;
    if (percentage >= 85) return 8.5;
    if (percentage >= 80) return 8.0;
    if (percentage >= 75) return 7.5;
    if (percentage >= 70) return 7.0;
    if (percentage >= 65) return 6.5;
    if (percentage >= 60) return 6.0;
    if (percentage >= 50) return 5.5;
    if (percentage >= 40) return 5.0;
    return 4.0;
  }
}
