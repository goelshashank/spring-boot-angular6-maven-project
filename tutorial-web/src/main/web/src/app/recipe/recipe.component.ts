import {Component, Injectable, OnInit} from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';
import {IngredientComp} from '../model/IngredientComp';

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
    ingCompMap : Map<number, Ingredient> = new Map<number, Ingredient>();
    totalCost : number;

  constructor(private http: HttpClient, public appComponent:AppComponent) {
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
  }


  addRecipes(form: NgForm) {

    this.addRecipe.ingredientComp=Array.from(this.ingCompMap.values());
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
      () => { console.log(' %% add recipe call is completed successfully %%'); });

     form.reset();
     this.ngOnInit();
  }

  setIngComps(ingList:Ingredient[]){

   let  ingCompMap : Map<number, Ingredient> = new Map<number, Ingredient>();

    ingList.forEach(t=> {
      if (this.ingCompMap.get(t.id) != undefined) {
        ingCompMap.set(t.id,this.ingCompMap.get(t.id));
      }else {
        ingCompMap.set(t.id,t);
      }
    });
    this.ingCompMap=ingCompMap;
    console.log('Ing comp list' + JSON.stringify(Array.from(this.ingCompMap.values())));
    this.calculateCost();
  }


   async calculateCost(){
    this.totalCost=0;
    this.ingCompMap.forEach((value, key) => {
      this.totalCost=this.totalCost+(value.perUnitCost*value.quantityUnit);
    });
  }

}
