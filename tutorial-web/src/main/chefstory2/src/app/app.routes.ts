import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";

export const routes: Routes = [

  { path: '', component: AppComponent },

  {
  path: 'chefstory',
  loadChildren: () => import('./store/store.module')
  .then(mod => mod.StoreModule)
}
];
