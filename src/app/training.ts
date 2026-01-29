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
      lessons: ['Lesson 1.1', 'Lesson 1.2', 'Lesson 1.3']
    },
    {
      id: 2,
      name: 'Module 2',
      progress: 75,
      lessons: ['Lesson 2.1', 'Lesson 2.2']
    },
    // Add more modules as needed
  ];

  getModuleById(id: number) {
    return this.modules.find(module => module.id === id);
  }

  getAllModules() {
    return this.modules;
  }
}