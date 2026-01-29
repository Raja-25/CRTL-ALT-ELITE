import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Contact } from './contact/contact'; // Import the ContactComponent
import { Trainings } from './trainings/trainings'; // Import TrainingsComponent if needed
import { ModuleDetails } from './module-details/module-details';
import { LessonDetails } from './lesson-details/lesson-details';

const routes: Routes = [
  { path: '', component: Trainings }, 
  { path: 'Home', component: Trainings },// Default route (can be your home or any component)
  { path: 'contact', component: Contact },
  { path: 'module/:id', component: ModuleDetails},
  { path: 'module/:moduleId/lesson/:lessonName', component: LessonDetails }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
