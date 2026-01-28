// import { Injectable } from '@angular/core';
// import { Question } from '../core/models/questions.model';
// import { QUESTIONS_6_9 } from '../core/constants/questions-6-9';
// import { QUESTIONS_10_12 } from '../core/constants/questions-10-12';

// @Injectable({ providedIn: 'root' })
// export class ScreeningService {

//   getRandomQuestions(grade: '6-9' | '10-12'): Question[] {
//     const source =
//       grade === '6-9' ? QUESTIONS_6_9 : QUESTIONS_10_12;

//     return this.shuffleArray(source).slice(0, 10);
//   }

//   calculateScore(
//     questions: Question[],
//     answers: number[]
//   ): number {
//     let score = 0;

//     questions.forEach((q, index) => {
//       if (q.correct === answers[index]) {
//         score++;
//       }
//     });

//     return score;
//   }

//   getEligibility(
//     grade: '6-9' | '10-12',
//     score: number
//   ) {
//     const percentage = (score / 10) * 100;

//     if (percentage < 60) {
//       return { eligible: false };
//     }

//     return {
//       eligible: true,
//       level:
//         grade === '6-9'
//           ? 'BEGINNER'
//           : 'BEGINNER + INTERMEDIATE'
//     };
//   }

//   private shuffleArray(array: Question[]): Question[] {
//     return [...array].sort(() => Math.random() - 0.5);
//   }
// }


import { Injectable } from '@angular/core';
import { QUESTIONS_6_9 } from '../core/constants/questions-6-9';
import { QUESTIONS_10_12 } from '../core/constants/questions-10-12';
import { Question } from '../core/models/questions.model';

@Injectable()
export class ScreeningService {

  constructor() {}

  // Pick 10 random questions for the grade
  getRandomQuestions(grade: '6-9' | '10-12'): Question[] {
    const source = grade === '6-9' ? QUESTIONS_6_9 : QUESTIONS_10_12;
    return this.shuffleArray(source).slice(0, 10);
  }

  // Simple shuffle helper
  private shuffleArray<T>(arr: T[]): T[] {
    return [...arr] // copy so original array isn't mutated
      .map(a => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);
  }

  // Calculate score by comparing answers with correct indices
  calculateScore(questions: Question[], answers: number[]): number {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct) score++;
    }
    return score;
  }

  // Determine eligibility based on your rules
  getEligibility(grade: '6-9' | '10-12', score: number): { eligible: boolean; level?: string } {
    if (grade === '6-9') {
      if (score >= 6) return { eligible: true, level: 'BEGINNER' };
      else return { eligible: false };
    } else {
      if (score >= 6) return { eligible: true, level: 'BEGINNER + INTERMEDIATE' };
      else return { eligible: false };
    }
  }
}
