import { Routes } from '@angular/router';
import { ScreeningComponent } from './features/screening/screening';
import { DropoutComponent } from './features/dropout/dropout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { SkillRatingsComponent } from './features/skill-ratings/skill-ratings';

export const routes: Routes = [
  { path: '', component: ScreeningComponent },
  { path: 'screening', component: ScreeningComponent },
  { path: 'dropout', component: DropoutComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'skillratings', component: SkillRatingsComponent },
  { path: '**', redirectTo: '' }
];
