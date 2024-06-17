import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';
import {CategoryFor} from './CategoryFor';
import {Category} from "./Category";
import {Brand} from "./Brand";
import {Supplier} from "./Supplier";
import {jsonIgnore} from "json-ignore";
import {BaseModel} from "./BaseModel";
import {Constants} from "../config/Constants";
import {OnInit} from "@angular/core";

export class Ingredient extends BaseModel{

  unit: string;
  photoId: string;
  videoId: string;
  status: string;
  gst:number;
  minimumInventory:number;

  supplierForIngredients: SupplierForIngredient[]=[];
  brandForIngredients: BrandForIngredient[]=[];
  categoriesForIngredient: CategoryFor[]=[];

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() subCatList:String[]=[];
  @jsonIgnore() brandList: String[]=[];
  @jsonIgnore() supplierList: String[]=[];


 addSupplier(supplier:Supplier) {
   let title:string=this.getTitle(supplier);
   if (!this.supplierForIngredients.map((o) => o.supplier.title).includes(title)) this.supplierForIngredients.push(new SupplierForIngredient(new Supplier(title)));
   console.log('After addition, Suppliers- ' + JSON.stringify(Array.from(this.supplierForIngredients)));
  }
  removeSupplier(supplier:Supplier){
    this.supplierForIngredients = this.supplierForIngredients.filter(({supplier}) => supplier.title != this.getTitle(supplier));
    console.log('After removal, Suppliers - ' + JSON.stringify(Array.from(this.supplierForIngredients)));
  }

  addCategory(t: Category,isSub:boolean) {
    let title = this.getTitle(t);
    if (!this.categoriesForIngredient.map((o) => o.category.title).includes(title)) this.categoriesForIngredient.push(new CategoryFor(new Category(title,Constants.INGREDIENT,isSub)));
    console.log('Added category, Categories - ' + JSON.stringify(Array.from(this.categoriesForIngredient)));
  }
  removeCategory(t: Category,isSub:boolean) {
    this.categoriesForIngredient = this.categoriesForIngredient.filter(({category}) => category.title != this.getTitle(t));
    console.log('Removed category, Categories - ' + JSON.stringify(Array.from(this.categoriesForIngredient)));
  }

  addBrand(t: Brand) {
    let title = this.getTitle(t);
    if (!this.brandForIngredients.map((o) => o.brand.title).includes(title)) this.brandForIngredients.push(new BrandForIngredient( new Brand(title),0,0));
    console.log('Added brand, Brands - ' + JSON.stringify(Array.from(this.brandForIngredients)));
  }
  removeBrand(t: Brand) {
    this.brandForIngredients = this.brandForIngredients.filter(({brand}) => brand.title != this.getTitle(t));
    console.log('Removed brand, Brands - ' + JSON.stringify(Array.from(this.brandForIngredients)));
  }

  static update(ingredient:Ingredient){
    ingredient.catList = CategoryFor.getMainCategoriesFor(ingredient.categoriesForIngredient).map((t) => t.category.title);
    ingredient.subCatList = CategoryFor.getSubCategoriesFor(ingredient.categoriesForIngredient).map((t) => t.category.title);
    ingredient.supplierList = ingredient.supplierForIngredients.map((t) => t.supplier.title);
    ingredient.brandList = ingredient.brandForIngredients.map((t) => t.brand.title)

    Ingredient.updateCosts(ingredient)
  }

  static updateCosts(ing:Ingredient){
    ing.brandForIngredients.forEach((t)=> {BrandForIngredient.updateCosts(t,ing.gst)})
  }

  static removeAllBrands(ing:Ingredient) {
    ing.brandForIngredients=null;
    ing.brandList=null;
  }

  static removeAllSuppliers(ing:Ingredient) {
    ing.supplierForIngredients=null;
    ing.supplierList=null;
  }

/*  static removeAllCategories(ing:Ingredient) {
    ing.catego=null;
    ing.brandList=null;
  }

  static removeAllSubCategories(ing:Ingredient) {
    ing.subcate=null;
    ing.brandList=null;
  }*/

}
