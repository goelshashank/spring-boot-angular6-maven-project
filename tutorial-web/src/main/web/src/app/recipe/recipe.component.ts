import {Component, Injectable, OnInit} from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
@Injectable()
export class RecipeComponent implements OnInit {

  title = 'recipe';
  addRecipe: AddRecipe = new AddRecipe(new Recipe(),[],[]);
  isShowAddRecipe=true;
  displayRecipeList: Recipe[]=[];
  displayIngredientList: Ingredient[]=[];
  constructor(private http: HttpClient, public appComponent:AppComponent) {
  }

  ngOnInit(): void {
  }

  toggleAddRecipe() {
    this.isShowAddRecipe = !this.isShowAddRecipe;
    this.displayRecipeList=this.appComponent.getAllRecipes()
    this.displayIngredientList=this.appComponent.getAllIngredients();
  }

  addRecipes(form: NgForm) {

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid)
      console.log("Add recipe list: "+ JSON.stringify(addRecipeList));

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });

    form.reset();
  }

}
