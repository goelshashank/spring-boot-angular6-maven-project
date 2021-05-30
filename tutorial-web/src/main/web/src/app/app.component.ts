import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiPaths } from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';

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
    constructor(private http: HttpClient) { }

    getAllRecipes() {
       this.http.get<Recipe[]>(environment.baseUrl + ApiPaths.GetAllRecipes).subscribe(
           (response) => {
             this.recipeList = response;
             console.log(JSON.stringify(this.recipeList));
             },
           (error) => { console.log('Error happened' + JSON.stringify(error)); },
           () => { console.log('the subscription is completed'); });
    }

  getAllIngredients() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.GetAllIngredients).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log(JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addIngredients() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.AddIngredients).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log(JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addRecipes() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.AddRecipes).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log(JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }

  addIngredientsToRecipe() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.AddIngredientsToRecipe).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log(JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }


}
