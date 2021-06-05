import {Component, Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiPaths } from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';
import {AddRecipe} from './model/AddRecipe';
import {NgForm} from '@angular/forms';
import {AppConfiguration} from './model/AppConfiguration';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements  OnInit {

     title = 'np-app';
     ingredientList : Ingredient[] = [];
     recipeList : Recipe[] = [];
     appConfiguration: AppConfiguration=new AppConfiguration();
     isShowAddIng=false;
     isShowAddRecipe=false;
      isDisplayAll=true;

    constructor(private http: HttpClient) {
      //this.getConfiguration();
    }

  ngOnInit(): void {
    this.getConfiguration();
  }

  toggleRecipe(){
    this.isShowAddRecipe=!this.isShowAddRecipe;
    this.isShowAddIng=false;
    this.isDisplayAll=false;
  }
  toggleIngredient(){
    this.isShowAddIng=!this.isShowAddIng;
    this.isShowAddRecipe=false;
    this.isDisplayAll=false;
  }
  toggleDisplayAll(){
    this.isDisplayAll=!this.isDisplayAll;
    this.isShowAddRecipe=false;
    this.isShowAddIng=false;
  }

    getAllRecipes() {
       this.http.get<Recipe[]>(environment.baseUrl + ApiPaths.GetAllRecipes).subscribe(
           (response) => {
             this.recipeList = response;
             console.log('Recipes - ' + JSON.stringify(this.recipeList));
             },
           (error) => { console.log('Error happened' + JSON.stringify(error)); },
           () => { console.log('the subscription is completed'); });
       return this.recipeList;
    }

  getAllIngredients() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.GetAllIngredients).subscribe(
      (response) => {
        this.ingredientList = response;
        console.log('Ingredients - ' + JSON.stringify(this.ingredientList));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
    return this.ingredientList;
  }


  getConfiguration() {
    this.http.get<AppConfiguration>(environment.baseUrl + ApiPaths.GetConfig).subscribe(
      (response) => {
        this.appConfiguration = response;
        console.log('AppConfiguration - ' + JSON.stringify(this.appConfiguration));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });
  }
}
