import {IngredientInRecip} from './IngredientInRecip';

export class Recipe {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  course: string;
  collections: string;
  source: string;
  serving: string;
  cookTime: string;
  prepTime: string;
  rating: number;
  instructions: string;
  shelfLife: string;
  remarks: string;
  status: string;
  ingredientInRecipe: IngredientInRecip[];
}
