import {Recipe} from './Recipe';
import {AddIngredient} from './AddIngredient';
import {AddCategory} from "./AddCategory";

export class AddRecipe {
  recipe: Recipe;
  addIngredients: AddIngredient[];
  addCategories: AddCategory[]=[];
}
