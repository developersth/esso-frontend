import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'page',
    loadChildren: () => import('../../components/page/page.module').then(m => m.PageModule)
  },
  {
    path: 'seals',
    loadChildren: () => import('../../components/seals/seals.module').then(m => m.SealsModule)
  },
  {
    path: 'trucks',
    loadChildren: () => import('../../components/trucks/truck.module').then(m => m.TruckModule)
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/user.module').then(m => m.UserModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/settings/settings.module').then(m => m.SettingsModule)
  }
];
