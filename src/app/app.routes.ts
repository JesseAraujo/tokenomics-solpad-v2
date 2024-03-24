import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: '',
        redirectTo: 'presale',
        pathMatch: 'full',
      },
      {
        path: 'presale',
        loadComponent: () =>
          import('./pages/presale/presale.component').then(
            (m) => m.PresaleComponent
          ),
      },
      {
        path: 'fair-lauch',
        loadComponent: () =>
          import('./pages/fair-launch/fair-launch.component').then(
            (m) => m.FairLaunchComponent
          ),
      },
      {
        path: 'private-sale',
        loadComponent: () =>
          import('./pages/private-sale/private-sale.component').then(
            (m) => m.PrivateSaleComponent
          ),
      },
    ],
  },
];
