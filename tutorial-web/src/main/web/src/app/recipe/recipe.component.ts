import {Component, Injectable, OnInit} from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';
import {AddIngredient} from '../model/AddIngredient';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
@Injectable()
export class RecipeComponent implements OnInit {

  addRecipe: AddRecipe = new AddRecipe();
  title = 'recipe';
  recipe: Recipe = new Recipe();
  addIngMap: Map<number, AddIngredient> = new Map<number, AddIngredient>();
  totalCost: number;

  constructor(private http: HttpClient, public appComponent: AppComponent) {
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
  }


  addRecipes(form: NgForm) {

    this.addRecipe.addIngredients = Array.from(this.addIngMap.values());
    this.addRecipe.recipe = this.recipe;

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid) {
      console.log('Add recipe list: ' + JSON.stringify(addRecipeList));
    }

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened' + JSON.stringify(error));
      },
      () => {
        console.log(' %% add recipe call is completed successfully %%');
      });

    form.reset();
    this.ngOnInit();
  }

  setIngredients(ingList: Ingredient[]) {

    let ingCompMap: Map<number, AddIngredient> = new Map<number, AddIngredient>();
    ingList.forEach(t => {
      let addIngredient: AddIngredient=new AddIngredient();
      if (this.addIngMap.get(t.id) != undefined) {
        addIngredient = this.addIngMap.get(t.id);
      } else {
        addIngredient.ingredient = t;
      }
      addIngredient.ingredient.quantityUnit = 1;
      ingCompMap.set(t.id, addIngredient);
    });
    this.addIngMap = ingCompMap;
    console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
    this.calculateCost();
  }

  async calculateCost() {
    this.totalCost = 0;
    this.addIngMap.forEach((value, key) => {
      this.totalCost = this.totalCost + (value.ingredient.perUnitCost * value.ingredient.quantityUnit);
    });
  }

}
