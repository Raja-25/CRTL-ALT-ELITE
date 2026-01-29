import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ScreeningService } from '../services/screening.service';
import { Question } from '../core/questions.model';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './screening.html',
  styleUrls: ['./screening.css'],
  providers: [ScreeningService]
})
export class ScreeningComponent {
  candidateName = '';
  candidatePhone = '';
  grades: number[] = [6, 7, 8, 9, 10, 11, 12];
  candidateGrade: number | null = null;
  bucket: '6-9' | '10-12' | null = null;

  showQuiz = false;
  questions: Question[] = [];
  currentIndex = 0;
  answers: number[] = [];

  showResult = false;
  score = 0;
  result: { eligible: boolean; level?: string } | null = null;
  submissionSuccess = false;

  constructor(
    private screeningService: ScreeningService,
    private http: HttpClient
  ) {}

  startQuiz() {
    if (!this.candidateName || !this.candidatePhone || this.candidateGrade === null) return;
    if (!this.isValidPhone()) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    this.bucket = this.candidateGrade >= 6 && this.candidateGrade <= 9 ? '6-9' : '10-12';

    this.questions = this.screeningService.getRandomQuestions(this.bucket);
    this.answers = Array(this.questions.length).fill(null);
    this.showQuiz = true;
  }

  goNext() {
    if (this.answers[this.currentIndex] === null) return;
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
  }

  goPrevious() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  selectAnswer(index: number) {
    this.answers[this.currentIndex] = index;
  }

  isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  submit() {
    if (!this.bucket) return;

    this.score = this.screeningService.calculateScore(this.questions, this.answers);
    this.result = this.screeningService.getEligibility(this.bucket, this.score);
    this.showResult = true;

    if (this.result.eligible) {
      const payload = {
        name: this.candidateName,
        phoneNumber: this.candidatePhone,
        passingScore: this.score
      };

      this.http.post('http://localhost:8000/passing_candidates', payload)
        .subscribe({
          next: () => this.submissionSuccess = true,
          error: (err) => console.error('Error sending payload:', err)
        });
    }
  }

  isValidPhone(): boolean {
    const digits = this.candidatePhone.replace(/\D/g, '');
    return digits.length === 10;
  }
}