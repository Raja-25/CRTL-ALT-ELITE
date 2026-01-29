import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { Trainings } from './trainings/trainings';
import { ModuleDetails } from './module-details/module-details';
import { ScreeningComponent } from './screening/screening';
import { DashboardComponent } from './dashboard/dashboard';
import { DropoutComponent } from './dropout/dropout';
import { SkillRatingsComponent } from './skill-ratings/skill-ratings';

const routes: Routes = [
  { path: '', component: Trainings }, 
  { path: 'home', component: Trainings },
  { path: 'contact', component: Contact },
  { path: 'module/:id', component: ModuleDetails },
  { path: 'screening', component: ScreeningComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dropout', component: DropoutComponent },
  { path: 'skills-ratings', component: SkillRatingsComponent },
  { path: '**', component: Trainings }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
