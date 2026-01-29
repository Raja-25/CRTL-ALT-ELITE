import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { DropoutService } from '../../services/dropout.service';

// Register ag-grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DropoutRiskData {
  student_id: number;
  display_name: string;
  age: number;
  grade: number;
  total_sessions: number;
  avg_gap_days: number;
  avg_duration: number;
  recent_avg_duration: number;
  avg_lessons: number;
  avg_quizzes: number;
  days_since_last_login: number;
  dropout_risk_score: number;
}

@Component({
  selector: 'app-dropout',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './dropout.html',
  styleUrls: ['./dropout.css'],
  providers: [DropoutService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropoutComponent implements OnInit {
  dropoutData: DropoutRiskData[] = [];
  loading = true;
  error: string | null = null;
  notificationSending = false;
  notificationSuccess = false;
  successMessage = '';

  // Pagination
  pageSize = 10;
  currentPage = 1;
  paginatedData: DropoutRiskData[] = [];
  totalPages = 0;

  // ag-Grid column definitions
  colDefs: ColDef[] = [
    { field: 'student_id', headerName: 'Student ID', width: 100 },
    { field: 'display_name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 80 },
    { field: 'grade', headerName: 'Grade', width: 80 },
    { field: 'total_sessions', headerName: 'Sessions', width: 100 },
    { field: 'avg_gap_days', headerName: 'Avg Gap (days)', width: 130, valueFormatter: (params: any) => params.value?.toFixed(2) || '0' },
    { field: 'avg_duration', headerName: 'Avg Duration (min)', width: 140, valueFormatter: (params: any) => params.value?.toFixed(2) || '0' },
    { field: 'recent_avg_duration', headerName: 'Recent Avg (min)', width: 140, valueFormatter: (params: any) => params.value?.toFixed(2) || '0' },
    { field: 'avg_lessons', headerName: 'Avg Lessons', width: 110, valueFormatter: (params: any) => params.value?.toFixed(2) || '0' },
    { field: 'avg_quizzes', headerName: 'Avg Quizzes', width: 110, valueFormatter: (params: any) => params.value?.toFixed(2) || '0' },
    { field: 'days_since_last_login', headerName: 'Days Since Login', width: 140, valueFormatter: (params: any) => params.value?.toFixed(1) || '0' },
    {
      field: 'dropout_risk_score',
      headerName: 'Risk Score',
      width: 110,
      valueFormatter: (params: any) => {
        const score = params.value;
        let badge = '';
        if (score >= 80) badge = 'Critical';
        else if (score >= 60) badge = 'High';
        else if (score >= 40) badge = 'Medium';
        else badge = 'Low';
        return `${score} (${badge})`;
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 100,
    flex: 1
  };

  constructor(
    private dropoutService: DropoutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDropoutData();
  }

  loadDropoutData() {
    this.loading = true;
    this.error = null;
    console.log('Starting to fetch dropout data...');
    this.dropoutService.getDropoutRiskData().subscribe({
      next: (data) => {
        console.log('Data received from backend:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data?.length);
        this.dropoutData = data && Array.isArray(data) ? data : [];
        console.log('Component dropoutData:', this.dropoutData);
        console.log('Component dropoutData length:', this.dropoutData.length);
        this.currentPage = 1;
        this.updatePaginatedData();
        this.loading = false;
        console.log('Loading set to:', this.loading);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading dropout data:', err);
        this.error = 'Failed to load dropout risk data. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  sendNotification() {
    if (this.dropoutData.length === 0) {
      this.error = 'No data available to send notifications';
      return;
    }

    this.notificationSending = true;
    this.error = null;

    this.dropoutService.sendNotification().subscribe({
      next: (response) => {
        console.log('Notification sent successfully:', response);
        this.notificationSuccess = true;
        this.successMessage = 'Notifications sent to all at-risk students successfully!';
        this.notificationSending = false;

        // Hide success message after 4 seconds
        setTimeout(() => {
          this.notificationSuccess = false;
        }, 4000);
      },
      error: (err) => {
        console.error('Error sending notification:', err);
        this.error = 'Failed to send notifications. Please try again.';
        this.notificationSending = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Pagination methods
  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dropoutData.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.dropoutData.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
      this.cdr.markForCheck();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

}