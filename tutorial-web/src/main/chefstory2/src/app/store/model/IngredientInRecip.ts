import {Ingredient} from './Ingredient';
import {Recipe} from './Recipe';
import {Supplier} from './Supplier';
import {Brand} from './Brand';
import {Category} from "./Category";
import { jsonIgnore } from 'json-ignore';
import {BaseModel} from "./BaseModel";


export class IngredientInRecip extends BaseModel{
  ingredient: Ingredient=new Ingredient(null);
  recipe: Recipe;
  subRecipe : Recipe;
  supplier: Supplier=new Supplier(null);
  brand: Brand=new Brand(null);
  category: Category =new Category(null,null,null);

  qty: number=0;

  @jsonIgnore() refQty;
  @jsonIgnore() costTotal:number=0;

}
