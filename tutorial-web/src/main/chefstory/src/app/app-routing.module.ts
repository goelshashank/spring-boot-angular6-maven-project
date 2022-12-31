import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipeComponent} from './recipe/recipe.component';
import {IngredientComponent} from './ingredient/ingredient.component';
import {AppComponent} from './app.component';

const routes: Routes = [
  { path: 'home', component: AppComponent,outlet:'right-wall' },
  { path: 'ingredient', component: IngredientComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: '**', redirectTo: 'home' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {


}
