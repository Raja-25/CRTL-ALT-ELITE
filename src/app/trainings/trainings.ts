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

  constructor(private router: Router, private trainingService: TrainingService) { }  // Added: Inject TrainingService

  ngOnInit(): void {
  // Fetch modules from the service on initialization
  this.modules = this.trainingService.getAllModules() as unknown as Module[];  // Cast via unknown
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
}