import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipeComponent} from './recipe/recipe.component';
import {IngredientComponent} from './ingredient/ingredient.component';
import {AppComponent} from './app.component';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
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
