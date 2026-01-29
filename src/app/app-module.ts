import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Trainings } from './trainings/trainings';
import { Contact } from './contact/contact';
import { ModuleDetails } from './module-details/module-details';
import { Dashboard } from './dashboard/dashboard';
import { Dropout } from './dropout/dropout';
import { Screening } from './screening/screening';

@NgModule({
  declarations: [
    App,
    Trainings,
    Contact,
    ModuleDetails,
    Dashboard,
    Dropout,
    Screening
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App]
})
export class AppModule { }
