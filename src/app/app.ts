import { Component } from '@angular/core';
import { ScreeningComponent } from './features/screening/screening';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScreeningComponent],
  template: `<app-screening></app-screening>`,
})
export class App {}
