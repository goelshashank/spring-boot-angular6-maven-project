import {IngredientInRecip} from './IngredientInRecip';
import {CategoryFor} from "./CategoryFor";
import {UnitDetailed} from "./UnitDetailed";

export class Recipe {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  course: string;
  collections: string;
  source: string;
  servingQty: string;
  cookTime: string;
  prepTime: string;
  rating: number;
  instructions: string;
  shelfLife: string;
  remarks: string;
  status: string;
  ingredientInRecipe: IngredientInRecip[];
  categoriesForRecipe:CategoryFor[];
  unitDetailed:UnitDetailed;
  unit:string;
}
