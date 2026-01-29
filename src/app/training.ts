import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private modules = [
    {
      id: 1,
      name: 'Module 1',
      progress: 50,
      lessons: [
        { 
          name: 'Digital Basics', 
          progress: 70,  // Lesson-specific progress (0-100)
          content: [
            { title: 'Computer Basics Part 1', text: 'This is the introduction to computer basics, covering hardware and software.' },
            { title: 'Computer Basics Part 2', text: 'This covers operating systems and file management.' },
            { title: 'Digital Wellbeing', text: 'Tips for safe and healthy digital habits.' }
          ], 
          completed: true  // For UI features like tick icons
        },
        { 
          name: 'Lesson 1.2', 
          progress: 40,
          content: [
            { title: 'Advanced Concepts Part 1', text: 'Deep dive into programming fundamentals.' },
            { title: 'Advanced Concepts Part 2', text: 'Practical applications and case studies.' }
          ], 
          completed: false 
        }
      ]
    },
    {
      id: 2,
      name: 'Module 2',
      progress: 75,
      lessons: [
        { 
          name: 'Lesson 2.1', 
          progress: 60,
          content: [
            { title: 'Basics of the Subject Part 1', text: 'Fundamentals of the topic.' },
            { title: 'Basics of the Subject Part 2', text: 'Introductory materials and examples.' }
          ], 
          completed: true 
        },
        { 
          name: 'Lesson 2.2', 
          progress: 80,
          content: [
            { title: 'Practical Examples Part 1', text: 'Step-by-step guides.' },
            { title: 'Practical Examples Part 2', text: 'Real-world scenarios and tips.' },
            { title: 'Conclusion Part 1', text: 'Summary and next steps.' }
          ], 
          completed: false 
        }
      ]
    },
    // Add more modules as needed
  ];

  getModuleById(id: number) {
    return this.modules.find(module => module.id === id);
  }

  getLessonByModuleAndName(moduleId: number, lessonName: string) {  // Added: This method fetches a specific lesson
    const module = this.getModuleById(moduleId);
    return module ? module.lessons.find(lesson => lesson.name === lessonName) : null;
  }

  getAllModules() {
    return this.modules;
  }
}