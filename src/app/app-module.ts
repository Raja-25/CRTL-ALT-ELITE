import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Trainings } from './trainings/trainings';
import { Contact } from './contact/contact';
import { ModuleDetails } from './module-details/module-details';
import { LessonDetails } from './lesson-details/lesson-details';
import { DashboardComponent } from './dashboard/dashboard';
import { DropoutComponent } from './dropout/dropout';
import { ScreeningComponent } from './screening/screening';
import { SkillRatingsComponent } from './skill-ratings/skill-ratings';

@NgModule({
  declarations: [
    App,
    Trainings,
    Contact,
    ModuleDetails,
    LessonDetails,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DashboardComponent,
    DropoutComponent,
    ScreeningComponent,
    SkillRatingsComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App]
})
export class AppModule { }
