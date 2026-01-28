import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Contact } from './contact/contact'; // Import the ContactComponent
import { Trainings } from './trainings/trainings'; // Import TrainingsComponent if needed

const routes: Routes = [
  { path: '', component: Trainings }, 
  { path: 'Home', component: Trainings },// Default route (can be your home or any component)
  { path: 'contact', component: Contact },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
