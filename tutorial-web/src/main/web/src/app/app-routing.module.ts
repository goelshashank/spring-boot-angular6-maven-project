import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipeComponent} from './recipe/recipe.component';
import {IngredientComponent} from './ingredient/ingredient.component';
import {AppComponent} from './app.component';

const routes: Routes = [    { path: 'recipe-editor', component: RecipeComponent,outlet:'right-wall' },
  { path: 'ingredient-editor', component: IngredientComponent , outlet:'right-wall' },
  { path: '**', component: AppComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
