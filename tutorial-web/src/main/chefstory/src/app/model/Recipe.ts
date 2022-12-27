import {IngredientInRecip} from './IngredientInRecip';
import {CategoryFor} from './CategoryFor';
import {UnitDetailed} from './UnitDetailed';
import { jsonIgnore } from 'json-ignore';
import { Category } from './Category';
import { Brand } from './Brand';
import { Supplier } from './Supplier';
import { Ingredient } from './Ingredient';
import {BaseModel} from "./BaseModel";

export class Recipe extends  BaseModel{
  collection: string;
  subCategory: string;
  course: string;
  source: string;
  servingQty: number;
  cookTime: string;
  prepTime: string;
  rating: number;
  instructions: string;
  shelfLife: string;
  remarks: string;
  status: string;
  ingredientInRecipe: IngredientInRecip[]=[];
  categoriesForRecipe: CategoryFor[]=[];
  unitDetailed: UnitDetailed=new UnitDetailed();
  unit: string;

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() ingList:String[]=[];
  @jsonIgnore() subRecipeList:String[]=[];

  @jsonIgnore() refServingQty:number;

}
