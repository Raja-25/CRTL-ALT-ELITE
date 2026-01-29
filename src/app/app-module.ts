import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Trainings } from './trainings/trainings';
import { Contact } from './contact/contact';
import { ModuleDetails } from './module-details/module-details';

@NgModule({
  declarations: [
    App,
    Trainings,
    Contact,
    ModuleDetails
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
