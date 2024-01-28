import {Ingredient} from './Ingredient';
import {Recipe} from './Recipe';
import {Supplier} from './Supplier';
import {Brand} from './Brand';
import {Category} from "./Category";
import { jsonIgnore } from 'json-ignore';


export class IngredientInRecip {
  ingredient: Ingredient=new Ingredient();
  recipe: Recipe;
  subRecipe : Recipe;
  supplier: Supplier=new Supplier();
  brand: Brand=new Brand();
  category: Category =new Category();

  qty: number=0;

  @jsonIgnore() refQty;
  @jsonIgnore() costTotal:number=0;

}
