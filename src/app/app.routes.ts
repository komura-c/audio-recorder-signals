import { Routes } from '@angular/router';
import { TopComponent } from './pages/top/top.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TopComponent
  },
];
