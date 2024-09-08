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
import * as console from "node:console";
import * as console from "node:console";
import * as console from "node:console";


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
  @jsonIgnore() private _costTotal:number;


  addSupplier(supplierForIngredient:SupplierForIngredient){
    this.supplierForIngredient=supplierForIngredient

    if(!this.ingredient.supplierForIngredients.map((o) => o.title).includes(supplierForIngredient.title))
    this.ingredient.supplierForIngredients.push(supplierForIngredient);
    console.log('After addition, suppliers for ingredients- ' + JSON.stringify(this.supplierForIngredient));
  }

  addBrand(brandForIngredient:BrandForIngredient){
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
    console.log('After addition, categories for ingredients- ' + JSON.stringify(this.brandForIngredient));
  }

  get costTotal(): number {
    if(this.brandForIngredient!=null)
      this._costTotal=this.qty*this.brandForIngredient.perUnitCost
    else
      this.costTotal(this.subRecipe.calculateCostTotal())
    return this._costTotal;
  }

  set costTotal(value: number) {
    this._costTotal = value;
  }




  getIngCostForRecipe(){

    if(this.ingredient!=null){
      this.costTotal = (this.ingredient.brandForIngredients.filter(t=> t.brand.id==this.brandForIngredient.brand.id)[0]
        .perUnitCost * this.qty);
    }else {

      let totalIngCost:number=0;

      //todo: to optimize this, either pre store during adding ingredient or calculate once while adding recipe.
      this.subRecipe.ingredientInRecipe.forEach((u)=> {

          if(u.ingredient!=null)
            totalIngCost =totalIngCost +  (u.ingredient
              .brandForIngredients.filter(t=> t.brand.id==u.brandForIngredient.brand.id)[0].perUnitCost * this.qty)
          else {
            u.subRecipe.ingredientInRecipe.forEach((t)=>t.getIngCostForRecipe());
          }
        }
      )
      this.costTotal=(totalIngCost/this.subRecipe.servingQty)*this.qty;
    }
  }


}
