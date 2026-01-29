import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../training';  // Added: Inject the service for dynamic data

// Define interfaces for better type safety and professionalism
interface Profile {
  name: string;
  role: string;
  bio: string;
}

interface Content {
  title: string;
  text: string;
}

interface Lesson {
  name: string;
  progress: number;  // Added: Lesson-specific progress
  content: Content[];  // Updated: Array of content objects
  completed: boolean;  // Added: Completion status
}

interface Module {
  id: number;
  name: string;
  progress: number;
  lessons: Lesson[];  // Updated: Lessons are now objects
  lastAccessedDate?: string;
  isCurrentlyEngaged?: boolean;
  consecutiveDaysEngaged?: number;
}

@Component({
  selector: 'app-trainings',
  standalone: false,
  templateUrl: './trainings.html',  // Ensure this matches your file name (you had './trainings.html', but it should be './trainings.component.html' if using Angular CLI)
  styleUrls: ['./trainings.css']  // Ensure this matches your file name
})
export class Trainings implements OnInit {  // Renamed class to 'TrainingsComponent' for Angular conventions (from 'Trainings')
  // Profile info with typed interface
  profile: Profile = {
    name: 'John Doe',
    role: 'Software Engineer',
    bio: 'Passionate about technology and continuous learning.'
  };

  // Learning modules data fetched from service
  modules: Module[] = [];

  // Calendar properties
  currentDate: Date = new Date();
  calendarDays: any[] = [];
  engagementDays: number[] = [1, 2, 3, 5, 7, 8, 9, 12, 14, 15, 16, 18, 20, 21, 22, 25, 27, 28, 29]; // Days engaged in January 2026
  monthName: string = '';

  constructor(private router: Router, private trainingService: TrainingService) { }  // Added: Inject TrainingService

  ngOnInit(): void {
  // Fetch modules from the service on initialization
  this.modules = this.trainingService.getAllModules() as unknown as Module[];  // Cast via unknown
  this.generateCalendar();
}

  onModuleClick(module: Module) {  // Updated: Use Module type
    this.router.navigate(['/module', module.id]);  // Navigate to /module/{id}
  }

  // Function to calculate the progress bar width based on the lesson completion percentage
  getProgressBarWidth(progress: number): string {
    return `${progress}%`;
  }

  // Handle lesson click event (supports both click and keyboard enter) - Now unused in this component, but kept for reference
  onLessonClick(lesson: Lesson): void {  // Updated: Use Lesson type
    console.log(`Lesson clicked: ${lesson.name}`);
    // TODO: Implement navigation to lesson content or modal display (handled in ModuleDetailsComponent)
  }

  // TrackBy function for modules to optimize *ngFor performance
  trackByModuleId(index: number, module: Module): number {
    return module.id;
  }

  // TrackBy function for lessons to optimize *ngFor performance
  trackByLessonId(index: number, lesson: Lesson): string {  // Updated: Use Lesson type
    return lesson.name;
  }

  // Get engagement status badge text
  getEngagementStatus(module: Module): string {
    if (module.isCurrentlyEngaged) {
      return `🔥 Active (${module.consecutiveDaysEngaged} days)`;
    } else if (module.consecutiveDaysEngaged && module.consecutiveDaysEngaged > 0) {
      return `⏸️ Paused (${module.consecutiveDaysEngaged} days ago)`;
    }
    return '❌ Not Started';
  }

  // Check if user is continuously engaged (more than 3 consecutive days)
  isContinuouslyEngaged(module: Module): boolean {
    return module.isCurrentlyEngaged === true && (module.consecutiveDaysEngaged || 0) >= 3;
  }

  // Generate calendar for current month
  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    this.monthName = monthNames[month];

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(day);
    }
  }

  // Check if a day is an engagement day
  isEngagementDay(day: number): boolean {
    return this.engagementDays.includes(day);
  }

  // Calculate total days in month
  getTotalDaysInMonth(): number {
    return this.calendarDays.filter(d => d !== null).length;
  }
}