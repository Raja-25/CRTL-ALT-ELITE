import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training';  // Adjust path if needed

interface Profile {
  name: string;
  role: string;
  bio: string;
}

@Component({
  selector: 'app-module-details',
  standalone: false,
  templateUrl: './module-details.html',
  styleUrl: './module-details.css',
})
export class ModuleDetails implements OnInit {
 module: any;  // Or define a proper interface

 profile: Profile = {
    name: 'John Doe',
    role: 'Software Engineer',
    bio: 'Passionate about technology and continuous learning.'
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,  // Add this
    private trainingService: TrainingService
  ) {}

ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (!idParam) {
    // Handle missing ID: redirect to home (or show an error message)
    this.router.navigate(['/']);
    return;
  }
  const id = +idParam;  // Now safe to convert
  this.module = this.trainingService.getModuleById(id);
  if (!this.module) {
    // Handle invalid ID: redirect to home
    this.router.navigate(['/']);
  }
}
  onLessonClick(lesson: string) {
    // Reuse or extend your existing logic, e.g., alert or navigate
    console.log('Clicked lesson:', lesson);
  }
  trackByLessonId(index: number, lesson: string): string {
  return lesson;  // Or use a unique ID if lessons have one, e.g., lesson.id
}
}
