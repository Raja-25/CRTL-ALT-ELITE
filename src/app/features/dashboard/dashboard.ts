import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

interface MonthlyOnboarding {
  month: string;
  count: number;
}

interface MonthlyDropoutRisk {
  month: string;
  count: number;
}

interface CourseCompletion {
  month: string;
  oneCourse: number;
  twoCourses: number;
  threeCourses: number;
}

interface StudentEngagement {
  module: string;
  activeStudents: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  onboardingData: MonthlyOnboarding[] = [
    { month: 'January', count: 45 },
    { month: 'February', count: 52 },
    { month: 'March', count: 48 },
    { month: 'April', count: 61 },
    { month: 'May', count: 55 },
    { month: 'June', count: 67 },
    { month: 'July', count: 72 },
    { month: 'August', count: 58 },
    { month: 'September', count: 64 },
    { month: 'October', count: 71 },
    { month: 'November', count: 68 },
    { month: 'December', count: 75 },
  ];

  dropoutRiskData: MonthlyDropoutRisk[] = [
    { month: 'January', count: 8 },
    { month: 'February', count: 12 },
    { month: 'March', count: 10 },
    { month: 'April', count: 15 },
    { month: 'May', count: 11 },
    { month: 'June', count: 18 },
    { month: 'July', count: 14 },
    { month: 'August', count: 16 },
    { month: 'September', count: 13 },
    { month: 'October', count: 19 },
    { month: 'November', count: 17 },
    { month: 'December', count: 20 },
  ];

  courseCompletionData: CourseCompletion[] = [
    { month: 'January', oneCourse: 25, twoCourses: 15, threeCourses: 5 },
    { month: 'February', oneCourse: 30, twoCourses: 18, threeCourses: 8 },
    { month: 'March', oneCourse: 28, twoCourses: 16, threeCourses: 6 },
    { month: 'April', oneCourse: 35, twoCourses: 22, threeCourses: 10 },
    { month: 'May', oneCourse: 32, twoCourses: 19, threeCourses: 9 },
    { month: 'June', oneCourse: 40, twoCourses: 25, threeCourses: 12 },
    { month: 'July', oneCourse: 42, twoCourses: 28, threeCourses: 14 },
    { month: 'August', oneCourse: 38, twoCourses: 24, threeCourses: 11 },
    { month: 'September', oneCourse: 36, twoCourses: 21, threeCourses: 10 },
    { month: 'October', oneCourse: 44, twoCourses: 30, threeCourses: 16 },
    { month: 'November', oneCourse: 41, twoCourses: 27, threeCourses: 15 },
    { month: 'December', oneCourse: 45, twoCourses: 32, threeCourses: 18 },
  ];

  engagementData: StudentEngagement[] = [
    { module: 'Safety Module', activeStudents: 456 },
    { module: 'Life Skills', activeStudents: 523 },
    { module: 'Career Building', activeStudents: 389 },
    { module: 'Financial Literacy', activeStudents: 612 },
    { module: 'Digital Skills', activeStudents: 478 },
    { module: 'Health & Wellness', activeStudents: 534 },
    { module: 'Communication', activeStudents: 445 },
    { module: 'Leadership', activeStudents: 392 },
  ];

  onboardingChart: Chart | null = null;
  dropoutRiskChart: Chart | null = null;
  courseCompletionChart: Chart | null = null;
  engagementChart: Chart | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    setTimeout(() => {
      this.createOnboardingChart();
      this.createDropoutRiskChart();
      this.createCourseCompletionChart();
      this.createEngagementChart();
      this.cdr.markForCheck();
    }, 100);
  }

  createOnboardingChart() {
    const ctx = document.getElementById('onboardingChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.onboardingChart) {
      this.onboardingChart.destroy();
    }

    this.onboardingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.onboardingData.map(d => d.month),
        datasets: [
          {
            label: 'Students Onboarded',
            data: this.onboardingData.map(d => d.count),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
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
          },
          datalabels: {
            display: true,
            align: 'top',
            offset: 10,
            color: '#333',
            font: { weight: 'bold', size: 11 },
            formatter: (value: any) => value.toString(),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  createDropoutRiskChart() {
    const ctx = document.getElementById('dropoutRiskChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.dropoutRiskChart) {
      this.dropoutRiskChart.destroy();
    }

    this.dropoutRiskChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dropoutRiskData.map(d => d.month),
        datasets: [
          {
            label: 'Students at Dropout Risk',
            data: this.dropoutRiskData.map(d => d.count),
            backgroundColor: [
              '#FF6B6B',
              '#FF8787',
              '#FF6B6B',
              '#FF4444',
              '#FF6B6B',
              '#FF3333',
              '#FF5555',
              '#FF4444',
              '#FF6B6B',
              '#FF2222',
              '#FF5555',
              '#FF1111',
            ],
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: '#CC0000',
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
          },
          datalabels: {
            display: true,
            align: 'top',
            offset: 10,
            anchor: 'end',
            color: '#333',
            font: { weight: 'bold', size: 11 },
            clamp: true,
            formatter: (value: any) => value.toString(),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 25,
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  createCourseCompletionChart() {
    const ctx = document.getElementById('courseCompletionChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.courseCompletionChart) {
      this.courseCompletionChart.destroy();
    }

    this.courseCompletionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.courseCompletionData.map(d => d.month),
        datasets: [
          {
            label: '1 Course Completed',
            data: this.courseCompletionData.map(d => d.oneCourse),
            backgroundColor: '#667eea',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: '2 Courses Completed',
            data: this.courseCompletionData.map(d => d.twoCourses),
            backgroundColor: '#764ba2',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: '3 Courses Completed',
            data: this.courseCompletionData.map(d => d.threeCourses),
            backgroundColor: '#f093fb',
            borderRadius: 8,
            borderSkipped: false,
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
            displayColors: true,
          },
          datalabels: {
            display: true,
            align: 'top',
            offset: 8,
            anchor: 'end',
            color: '#333',
            font: { weight: 'bold', size: 10 },
            clamp: true,
            formatter: (value: any) => value.toString(),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 60,
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            stacked: false,
            ticks: {
              font: { size: 12 },
              color: '#666',
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  createEngagementChart() {
    const ctx = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.engagementChart) {
      this.engagementChart.destroy();
    }

    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe',
      '#00f2fe', '#43e97b', '#fa709a', '#fee140'
    ];

    this.engagementChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.engagementData.map(d => d.module),
        datasets: [
          {
            data: this.engagementData.map(d => d.activeStudents),
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 3,
            hoverBorderColor: '#333',
            hoverBorderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, weight: 'bold' },
              color: '#333',
              padding: 15,
              boxWidth: 15,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} students (${percentage}%)`;
              }
            }
          },
          datalabels: {
            display: true,
            color: '#333',
            font: { weight: 'bold', size: 11 },
            formatter: function(value: any, context: any) {
              const total = context.dataset.data.reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return percentage + '%';
            }
          }
        },
      },
    });
  }
}
