import { Routes } from '@angular/router';
import { ScreeningComponent } from './features/screening/screening';
import { DropoutComponent } from './features/dropout/dropout';

export const routes: Routes = [
  { path: '', component: ScreeningComponent },
  { path: 'screening', component: ScreeningComponent },
  { path: 'dropout', component: DropoutComponent },
  { path: '**', redirectTo: '' }
];
