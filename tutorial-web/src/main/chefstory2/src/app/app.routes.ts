import { Routes } from '@angular/router';

export const routes: Routes = [

  {
  path: 'chefstory',
  loadChildren: () => import('./store/store.module')
  .then(mod => mod.StoreModule)
}
];
