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

  addRecipe: AddRecipe=new AddRecipe();
  title = 'recipe';
  recipe :Recipe=new Recipe();
  ingredientCompId:number;
  recipeCompId:number;
  constructor(private http: HttpClient, public appComponent:AppComponent) {
  }

  ngOnInit(): void {
   this.appComponent.refreshAppCache();
  }


  addRecipes(form: NgForm) {

    let addRecipeCompIdList: number[] = [];
    let addIngCompIdList: number[] = [];
    addRecipeCompIdList.push(this.recipeCompId);
    addIngCompIdList.push(this.ingredientCompId);

    this.addRecipe.recipeCompIds=addRecipeCompIdList;
    this.addRecipe.ingredientCompIds=addIngCompIdList;
    this.addRecipe.recipe=this.recipe;

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid)
      console.log("Add recipe list: "+ JSON.stringify(addRecipeList));

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -'+ JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('add recipe call is completed'); });

     form.reset();
     this.ngOnInit();
  }

}
