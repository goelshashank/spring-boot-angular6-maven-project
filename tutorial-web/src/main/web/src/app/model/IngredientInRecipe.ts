import { Injectable} from '@angular/core';
import { Ingredient } from './Ingredient';
import { Recipe } from './Recipe';

@Injectable()
export class IngredientInRecipe {
  id:number;
  recipe_id: number ;
  ingredient: Ingredient ;
  recipe: Recipe ;
}
