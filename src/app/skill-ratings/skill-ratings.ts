import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

interface Skill {
  skill: string;
  rating: number;
}

interface JobRole {
  role: string;
  required_skills: string[];
}

interface SkillRatingResponse {
  status: string;
  top_5_skills: Skill[];
  relevant_job_roles: JobRole[];
}

@Component({
  selector: 'app-skill-ratings',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './skill-ratings.html',
  styleUrls: ['./skill-ratings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillRatingsComponent implements OnInit {
  top5Skills: Skill[] = [];
  relevantJobRoles: JobRole[] = [];
  loading = true;
  error: string | null = null;
  skillChart: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.loadSkillRatings();
  }

  loadSkillRatings() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.http.get<SkillRatingResponse>('http://127.0.0.1:8000/skill-ratings').subscribe(
      (response) => {
        this.top5Skills = response.top_5_skills;
        this.relevantJobRoles = response.relevant_job_roles;
        this.loading = false;
        this.cdr.markForCheck();

        setTimeout(() => {
          this.createSkillChart();
        }, 100);
      },
      (error) => {
        console.error('Error loading skill ratings:', error);
        this.error = 'Failed to load skill ratings. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }

  createSkillChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = document.getElementById('skillChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.skillChart) {
      this.skillChart.destroy();
    }

    this.skillChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.top5Skills.map(s => s.skill),
        datasets: [
          {
            label: 'Skill Rating (out of 5)',
            data: this.top5Skills.map(s => s.rating),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { size: 14, weight: 'bold' },
              color: '#333',
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `Rating: ${context.parsed.r} / 5`;
              },
            },
          },
          datalabels: {
            display: true,
            color: '#333',
            font: { weight: 'bold', size: 12 },
            formatter: (value: any) => value.toString(),
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            ticks: {
              font: { size: 11 },
              color: '#666',
              stepSize: 1,
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            pointLabels: {
              font: { size: 12, weight: 'bold' },
              color: '#333',
            },
          },
        },
      },
    });
  }

  getJobMatchPercentage(jobRole: JobRole): number {
    const studentSkills = new Set(this.top5Skills.map(s => s.skill));
    const requiredSkills = jobRole.required_skills;
    const matchedSkills = requiredSkills.filter(skill => studentSkills.has(skill)).length;
    return Math.round((matchedSkills / requiredSkills.length) * 100);
  }

  getMatchColor(percentage: number): string {
    if (percentage === 100) return '#2ecc71'; // Green
    if (percentage >= 66) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  }

  getMatchLabel(percentage: number): string {
    if (percentage === 100) return '✓ Perfect Match';
    if (percentage >= 66) return '◐ Good Match';
    return '◑ Partial Match';
  }

  isSkillMatched(requiredSkill: string): boolean {
    return this.top5Skills.some(s => s.skill === requiredSkill);
  }

  getMatchedSkillsCount(requiredSkills: string[]): number {
    return requiredSkills.filter(s => this.isSkillMatched(s)).length;
  }

  getPerfectMatchCount(): number {
    return this.relevantJobRoles.filter(job => this.getJobMatchPercentage(job) === 100).length;
  }

  getAverageRating(): string {
    if (this.top5Skills.length === 0) return '0.0';
    const sum = this.top5Skills.reduce((acc, skill) => acc + skill.rating, 0);
    return (sum / this.top5Skills.length).toFixed(1);
  }
}