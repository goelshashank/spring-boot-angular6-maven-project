import { Injectable} from '@angular/core';
import { Ingredient } from './Ingredient';
import { Recipe } from './Recipe';

@Injectable()
export class IngredientInRecipe {
  id:number;
  recipeId: number ;
  ingredientComp: Ingredient ;
  recipeComp: Recipe ;
}
