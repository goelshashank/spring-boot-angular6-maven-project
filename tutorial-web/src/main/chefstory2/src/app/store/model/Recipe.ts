import {IngredientInRecip} from './IngredientInRecip';
import {CategoryFor} from './CategoryFor';
import {UnitDetailed} from './UnitDetailed';
import { jsonIgnore } from 'json-ignore';
import {BaseModel} from "./BaseModel";
import {Ingredient} from "./Ingredient";
import {SupplierForIngredient} from "./SupplierForIngredient";
import {Supplier} from "./Supplier";
import {Category} from "./Category";
import {Constants} from "../config/Constants";

export class Recipe extends  BaseModel{

  collection: string;
  course: string;
  source: string;
  sourceURL: string;
  method: string;
  notes: string;
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
  unitDetailed: UnitDetailed=new UnitDetailed(null);
  unit: string;

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() subCatList:String[]=[];
  @jsonIgnore() ingList:String[]=[];
  @jsonIgnore() subRecipeList:String[]=[];

  @jsonIgnore() refServingQty:number;


  addIngredient(ingredient:Ingredient){
     if(!this.ingredientInRecipe.map((o) => o.ingredient.title).includes(ingredient.title)) this.ingredientInRecipe.push(new IngredientInRecip(ingredient,null))
     console.log('After addition, Ingredients in Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
     this.calculateCost(ingredient,null,"add");
  }

  removeIngredient(ing:Ingredient) {
    this.ingredientInRecipe = this.ingredientInRecipe.filter(({ingredient}) => ingredient.title != ing.getTitle(ing));
    console.log('After removal, ingredients in Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(ing,null,"remove");
  }

  addSubRecipe(recipe:Recipe){
    if(!this.ingredientInRecipe.map((o) => o.subRecipe.title).includes(recipe.title)) this.ingredientInRecipe.push(new IngredientInRecip(null,recipe))
    console.log('After addition, Ingredients- ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(null,recipe,"add");
  }

  removeSubRecipe(recipe:Recipe) {
    let t:Recipe=this.appComponent.getAllRecipes().filter(u=> u.title==recipe.getTitle(recipe))[0];
    // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
    this.calculateCostTotal(null,recipe,"remove");
  }

  addCategory(t: Category,isSub:boolean) {
    let title=this.getTitle(t);
    if (!this.categoriesForRecipe.map((o) => o.category.title).includes(title)) this.categoriesForRecipe.push(new CategoryFor(new Category(title,Constants.RECIPE,isSub)));
    console.log('Added:  Category  in recipe - ' + JSON.stringify(Array.from(this.categoriesForRecipe)));
  }

  removeCategory(t: Category,isSub:boolean) {
    this.categoriesForRecipe = this.categoriesForRecipe.filter(({ category }) => category.title != this.getTitle(t));
    console.log('Removed: Category in recipe - ' + JSON.stringify(Array.from(this.categoriesForRecipe)));
  }

  sortRecipes(type: string) {
    this.sortRecipesBy = type;
    if (type == 'category') {
      this.appComponent.sortRecipesByCategory(this.appComponent.recipes)
    }
  }

  resetIngSelects(){
    this.ingredientInRecipe=this.ingredientInRecipe.filter(o=> o.ingredient==null)
    this.calculateCostTotal();

  }

  resetSubRecipeSelects(){
    this.ingredientInRecipe=this.ingredientInRecipe.filter(o=> o.subRecipe==null)
    this.calculateCostTotal();
  }


}
