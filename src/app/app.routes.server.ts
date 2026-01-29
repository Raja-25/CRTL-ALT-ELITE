import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'Home', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'module/:id', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Prerender },
  { path: 'dropout', renderMode: RenderMode.Prerender },
  { path: 'screening', renderMode: RenderMode.Prerender },
  { path: 'skill-ratings', renderMode: RenderMode.Prerender },
  { path: 'trainings', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];
