import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training';  // Adjust path if needed

// Define interfaces for better type safety
interface Content {
  title: string;
  text: string;
}

interface Lesson {
  name: string;
  progress: number;
  content: Content[];
  completed: boolean;
}

interface Profile {
  name: string;
  role: string;
  bio: string;
}

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.html',
  styleUrls: ['./lesson-details.css'],
  standalone:false ,
})
export class LessonDetails implements OnInit {
  lesson: Lesson | null = null;  // Updated: Use proper type with null
  profile: Profile = {
    name: 'John Doe',
    role: 'Software Engineer',
    bio: 'Passionate about technology and continuous learning.'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService
  ) {}

  ngOnInit() {
    const moduleIdParam = this.route.snapshot.paramMap.get('moduleId');
    const lessonNameParam = this.route.snapshot.paramMap.get('lessonName');
    if (!moduleIdParam || !lessonNameParam) {
      this.router.navigate(['/']);  // Redirect if params are missing
      return;
    }
    const moduleId = +moduleIdParam;
    this.lesson = this.trainingService.getLessonByModuleAndName(moduleId, lessonNameParam) as Lesson | null;  // Cast to resolve type error
    if (!this.lesson) {
      this.router.navigate(['/']);  // Redirect if lesson not found
    }
  }

  onContentClick(content: Content) {  // Updated: Use Content type
    // Handle content click, e.g., mark as read, expand, or log
    console.log('Content clicked:', content.title);
    // TODO: Add logic to mark content as completed or navigate further
  }

  getProgressBarWidth(progress: number): string {
    return `${progress}%`;
  }
}