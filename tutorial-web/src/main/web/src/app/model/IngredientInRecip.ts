import {Ingredient} from './Ingredient';
import {Recipe} from './Recipe';
import {Supplier} from './Supplier';
import {Brand} from './Brand';
import {Category} from "./Category";


export class IngredientInRecip {
  ingredient: Ingredient=new Ingredient();
  recipe: Recipe;
  supplier: Supplier=new Supplier();
  brand: Brand=new Brand();
  category: Category =new Category();
}
