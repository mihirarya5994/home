import { Routes, RouterModule } from '@angular/router';

import { SplashComponent } from './components/splash/splash.component';
import { AuthGuard } from './core/guards/auth.guard';
import { TpGameComponent } from './components/tp-game/tp-game.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/splash',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      showFooter: false
    }
  },
  {
    path: 'index.html',
    redirectTo: '/splash',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      showFooter: false
    }
  },
  {
    path: 'splash',
    pathMatch: 'full',
    component: SplashComponent,
    canActivate: [AuthGuard],
    data: {
      showFooter: false
    }
  },
  {
    path: 'dashboard',
    loadChildren: './components/home/home.module#HomeModule',
    canActivate: [AuthGuard],
    data: {
      showFooter: true
    }
  },
  {
    path: 'profile',
    loadChildren: './components/profile/profile.module#ProfileModule',
    canActivate: [AuthGuard],
    data: {
      showFooter: true
    }
  },
  {
    path: 'prizes',
    loadChildren: './components/prizes/prizes.module#PrizesModule',
    canActivate: [AuthGuard],
    data: {
      showFooter: true
    }
  },
  {
    path: 'tpgames/:gameName',
    component: TpGameComponent
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
