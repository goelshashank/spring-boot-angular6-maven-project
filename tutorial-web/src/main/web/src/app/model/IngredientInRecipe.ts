import { Ingredient ,Recipe} from 'model/';
import { Injectable} from '@angular/core';

@Injectable()
export class IngredientInRecipe {
  recipe_id: number ;
  ingredient: Ingredient ;
  recipe: Recipe ;
}
