import {AddSupplier} from './AddSupplier';
import {Ingredient} from './Ingredient';
import {AddBrand} from './AddBrand';
import {AddCategory} from './AddCategory';

export class AddIngredient {
  ingredient: Ingredient = new Ingredient();
  addSuppliers: AddSupplier[] = [];
  addBrands: AddBrand[] = [];
  addCategories: AddCategory[] = [];

}
