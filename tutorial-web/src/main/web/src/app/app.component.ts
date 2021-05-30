import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiPaths } from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';
import {AddIngredientsToRecipe} from './model/AddIngredientsToRecipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {

     title = 'np-app';
     recipeList: Recipe[] = [];
     ingredientList: Ingredient[] = [];
     addIngsToRecipe: AddIngredientsToRecipe[] = [];
    constructor(private http: HttpClient) { }

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

  addIngredients() {
    this.http.post(environment.baseUrl + ApiPaths.AddIngredients, this.ingredientList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addRecipes() {
    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, this.recipeList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addIngredientsToRecipe() {
    this.http.post(environment.baseUrl + ApiPaths.AddIngredientsToRecipe,this.addIngsToRecipe).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }


}
