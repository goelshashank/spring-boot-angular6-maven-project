import {Ingredient} from './Ingredient';
import {Recipe} from './Recipe';
import {Supplier} from './Supplier';
import {Brand} from './Brand';
import {Category} from "./Category";
import { jsonIgnore } from 'json-ignore';
import {BaseModel} from "./BaseModel";
import {CategoryFor} from "./CategoryFor";
import {BrandForIngredient} from "./BrandForIngredient";
import {SupplierForIngredient} from "./SupplierForIngredient";


export class IngredientInRecip extends BaseModel{

  constructor( ingredient: Ingredient,subRecipe:Recipe) {
    super(null);
    this.qty=1
    this.ingredient = ingredient;
    this.subRecipe=subRecipe;
  }

  ingredient: Ingredient=new Ingredient(null);
  recipe: Recipe;
  subRecipe : Recipe;
  supplierForIngredient: SupplierForIngredient=new SupplierForIngredient(null);
  brandForIngredient: BrandForIngredient=new BrandForIngredient(null,null,null);
  categoriesForIngredient: CategoryFor[]=[];

  qty: number=0;

  @jsonIgnore() refQty;
  @jsonIgnore() costTotal:number=0;

  addSuppliers(supplierForIngredient:SupplierForIngredient){
    this.supplierForIngredient=supplierForIngredient

    if(!this.ingredient.supplierForIngredients.map((o) => o.title).includes(supplierForIngredient.title))
    this.ingredient.supplierForIngredients.push(supplierForIngredient);
    console.log('After addition, suppliers for ingredients- ' + JSON.stringify(this.supplierForIngredient));
  }
  addBrands(brandForIngredient:BrandForIngredient){
    this.brandForIngredient=brandForIngredient;

    if(!this.ingredient.brandForIngredients.map((o) => o.title).includes(brandForIngredient.title))
       this.ingredient.brandForIngredients.push(brandForIngredient);
    console.log('After addition, brands for ingredients- ' + JSON.stringify(this.brandForIngredient));
  }

  addCategories(categories:CategoryFor[]){
    this.categoriesForIngredient=categories;

    categories.forEach(t=> {
      if (!this.ingredient.categoriesForIngredient.map((o) => o.title).includes(t.title))
        this.ingredient.categoriesForIngredient.push(t);
    }
  )
    console.log('After addition, brands for ingredients- ' + JSON.stringify(this.brandForIngredient));
  }

}
