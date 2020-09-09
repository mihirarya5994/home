import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PrizesComponent } from './prizes.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PrizesComponent,
    canActivate: [AuthGuard]
  }
  // profile
  // prizes
  // accomplishments
  // footer
  // header
];

export const PrizesRoutes = RouterModule.forChild(routes);