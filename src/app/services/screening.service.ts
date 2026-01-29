import { Injectable } from '@angular/core';
import { QUESTIONS_6_9 } from '../core/questions-6-9';
import { QUESTIONS_10_12 } from '../core/questions-10-12';
import { Question } from '../core/questions.model';

@Injectable()
export class ScreeningService {

  constructor() {}

  getRandomQuestions(grade: '6-9' | '10-12'): Question[] {
    const source = grade === '6-9' ? QUESTIONS_6_9 : QUESTIONS_10_12;

    const cloned = source.map(q => ({
      ...q,
      options: [...q.options] // deep copy options
    }));

    return this.shuffleArray(cloned).slice(0, 10);
  }
  
  private shuffleArray<T>(arr: T[]): T[] {
    return [...arr] 
      .map(a => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);
  }
  
  calculateScore(questions: Question[], answers: number[]): number {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct) score++;
    }
    return score;
  }

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