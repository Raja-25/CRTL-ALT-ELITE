import { Component, OnInit } from '@angular/core';

// Define interfaces for better type safety and professionalism
interface Profile {
  name: string;
  role: string;
  bio: string;
}

interface Module {
  id: number;
  name: string;
  progress: number;
  lessons: string[];
}

@Component({
  selector: 'app-trainings',
  standalone: false,
  templateUrl: './trainings.html',
  styleUrls: ['./trainings.css']
})
export class Trainings implements OnInit {
  // Profile info with typed interface
  profile: Profile = {
    name: 'John Doe',
    role: 'Software Engineer',
    bio: 'Passionate about technology and continuous learning.'
  };

  // Learning modules data with typed interface
  modules: Module[] = [
    { id: 1, name: 'Frontend Development', progress: 60, lessons: ['HTML Basics', 'CSS Styling', 'JavaScript Essentials'] },
    { id: 2, name: 'Backend Development', progress: 30, lessons: ['Node.js Basics', 'Express.js Overview'] },
    { id: 3, name: 'Angular Mastery', progress: 80, lessons: ['Components', 'Services', 'Routing'] }
  ];

  constructor() { }

  ngOnInit(): void { }

  // Function to calculate the progress bar width based on the lesson completion percentage
  getProgressBarWidth(progress: number): string {
    return `${progress}%`;
  }

  // Handle lesson click event (supports both click and keyboard enter)
  onLessonClick(lesson: string): void {
    console.log(`Lesson clicked: ${lesson}`);
    // TODO: Implement navigation to lesson content or modal display
  }

  // TrackBy function for modules to optimize *ngFor performance
  trackByModuleId(index: number, module: Module): number {
    return module.id;
  }

  // TrackBy function for lessons to optimize *ngFor performance
  trackByLessonId(index: number, lesson: string): string {
    return lesson;
  }
}