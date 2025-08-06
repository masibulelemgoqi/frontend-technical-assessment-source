import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'inbox',
    loadComponent: () => import('./inbox/inbox.page').then((m) => m.InboxPage)
  },
  {
    path: 'complete',
    loadComponent: () => import('./complete/complete.page').then((m) => m.CompletePage)
  }
];
