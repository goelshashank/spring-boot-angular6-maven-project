import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiPaths } from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';
import {AddIngredientsToRecipe} from './model/AddIngredientsToRecipe';
import {NgForm} from '@angular/forms';
import {AppConfiguration} from './model/AppConfiguration';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {

     title = 'np-app';
     recipe: Recipe=new Recipe();
     ingredient: Ingredient=new Ingredient();
     addIngsToRecipe: AddIngredientsToRecipe[] = [];
     ingredientList : Ingredient[] = [];
     recipeList : Recipe[] = [];
      isShowAddIng=true;
      isShowAddRecipe=true;
    appConfiguration: AppConfiguration=new AppConfiguration();
    constructor(private http: HttpClient) {
      this.getConfiguration();
    }

    getAllRecipes() {
       this.http.get<Recipe[]>(environment.baseUrl + ApiPaths.GetAllRecipes).subscribe(
           (response) => {
             this.recipeList = response;
             console.log('Recipes - ' + JSON.stringify(this.recipeList));
             },
           (error) => { console.log('Error happened' + JSON.stringify(error)); },
           () => { console.log('the subscription is completed'); });
    }

  getAllIngredients() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.GetAllIngredients).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log('Ingredients - ' + JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addIngredients(form: NgForm) {
    let ingredientList: Ingredient[] = [];
    ingredientList.push(this.ingredient);

    if (form.valid)
      console.log("Add ingredient input: "+JSON.stringify(ingredientList));

    this.http.post(environment.baseUrl + ApiPaths.AddIngredients, ingredientList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });

    form.reset();
  }

  addRecipes(form: NgForm) {

    let recipeList: Recipe[] = [];
    recipeList.push(this.recipe);

    if (form.valid)
         console.log("Add recipe input: "+ JSON.stringify(recipeList));

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, recipeList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });

    form.reset();
  }

/*  addRecipe(addIngsToRecipe:AddIngredientsToRecipe) {
    this.http.post(environment.baseUrl + ApiPaths.AddIngredientsToRecipe, addIngsToRecipe).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }*/

  toggleAddIng() {
    this.isShowAddIng = !this.isShowAddIng;
  }
  toggleAddRecipe() {
    this.isShowAddRecipe = !this.isShowAddRecipe;
      this.getAllIngredients()
  }

  getConfiguration() {
    this.http.get<AppConfiguration>(environment.baseUrl + ApiPaths.GetConfig).subscribe(
      (response) => {
        this.appConfiguration = response;
        console.log('Ingredients - ' + JSON.stringify(this.appConfiguration));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }
}
