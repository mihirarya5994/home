import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    // canActivate: [AuthGuard]
  }
  // profile
  // prizes
  // accomplishments
  // footer
  // header
];

export const HomeRoutes = RouterModule.forChild(routes);
