import {IngredientInRecip} from './IngredientInRecip';
import {CategoryFor} from './CategoryFor';
import {UnitDetailed} from './UnitDetailed';
import {jsonIgnore} from 'json-ignore';
import {BaseModel} from "./BaseModel";
import {Ingredient} from "./Ingredient";
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
  perUnitCost:number;

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() subCatList:String[]=[];
  @jsonIgnore() ingList:String[]=[];
  @jsonIgnore() subRecipeList:String[]=[];

  @jsonIgnore() refServingQty:number;

  addIngMap: Map<String, IngredientInRecip> = new Map<String, IngredientInRecip>();
  addSubRecipeMap: Map<String, IngredientInRecip> = new Map<String, IngredientInRecip>();


  populateIngInRecipeFromMap() {
    this.ingredientInRecipe=[];
    this.ingredientInRecipe.concat(Array.from(this.addIngMap.values()));
    this.ingredientInRecipe.concat(Array.from(this.addSubRecipeMap.values()));

    console.log('Ingredients/SubRecipes in Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
  }

  addIngredient(ing:Ingredient){

      let ingredientInRecip:IngredientInRecip=new IngredientInRecip(ing, null)
      this.addIngMap.set(ing.title, ingredientInRecip);
      this.calculateCost(ingredientInRecip,Constants.ADD)
  }

  removeIngredient(ing:Ingredient) {
    let ingredientInRecip:IngredientInRecip=this.addIngMap.get(ing.title)
    this.addIngMap.delete(ing.title);
    this.calculateCost(ingredientInRecip, Constants.REMOVE)
  }

  addSubRecipe(recipe:Recipe){
      let ingredientInRecip:IngredientInRecip=new IngredientInRecip(null, recipe)
      this.addSubRecipeMap.set(recipe.title, ingredientInRecip);
      this.calculateCost(ingredientInRecip,Constants.ADD)
  }

  removeSubRecipe(recipe:Recipe) {
    let ingredientInRecip:IngredientInRecip=this.addSubRecipeMap.get(recipe.title)
    this.addSubRecipeMap.delete(recipe.title);
    this.calculateCost(ingredientInRecip, Constants.REMOVE)
  }

  removeAllIngredients(){
    this.addIngMap=new Map<String, IngredientInRecip>();
    this.calculateCostTotal()
  }

  removeAllSubRecipes(){
    this.addSubRecipeMap=new Map<String, IngredientInRecip>();
    this.calculateCostTotal();
  }

  addCategory(t: Category,isSub:boolean) {

    let title=this.getTitle(t);

    if (!this.categoriesForRecipe.map((o) => o.category.title).includes(title)) {
      let u: CategoryFor = new CategoryFor(null);
      u.category = new Category(null,null,null);
      u.category.title = title;
      u.category.type = Constants.RECIPE;
      u.category.isSub=isSub;
      this.categoriesForRecipe.push(u);
    }

    console.log('Added: recipe Categories  list' + JSON.stringify(Array.from(this.categoriesForRecipe)));
  }

  removeCategory(t: Category,isSub:boolean) {
    let title=this.getTitle(t);

    this.categoriesForRecipe = this.categoriesForRecipe.filter(({ category }) => category.title != title);

    console.log('Removed: recipe categories  list' + JSON.stringify(Array.from(this.categoriesForRecipe)));
  }


 static update(recipe:Recipe){

    recipe.refServingQty=null
    // console.log('Updating Recipe - ' + JSON.stringify(this.addRecipe.recipe))

   recipe.catList=CategoryFor.getMainCategoriesFor(recipe.categoriesForRecipe).map((t)=> t.category.title);
   recipe.subCatList=CategoryFor.getSubCategoriesFor(recipe.categoriesForRecipe).map((t)=> t.category.title);
   recipe.ingList=recipe.ingredientInRecipe.filter((u)=>u.ingredient!=null)
      .map((t)=> t.ingredient.title);
    recipe.subRecipeList=recipe.ingredientInRecipe.filter((u)=> u.subRecipe!=null)
      .map((t)=> t.subRecipe.title);

    // console.log('Ingredients in Recipe - ' + JSON.stringify(this.displayRecipeInfo.ingredientInRecipe))
    recipe.ingredientInRecipe.forEach((o)=>{
      if(o.ingredient!=null) {
        Ingredient.update(o.ingredient)
        recipe.calculateIngCostForRecipe(o);
      }else if(o.subRecipe!=null){
        recipe.calculateIngCostForRecipe(o);

        o.subRecipe.catList = CategoryFor.getMainCategoriesFor(o.subRecipe.categoriesForRecipe).map((t) => t.category.title);
        o.subRecipe.subCatList = CategoryFor.getSubCategoriesFor(o.subRecipe.categoriesForRecipe).map((t) => t.category.title);
      }

    });

  }

  calculateCost(ingInRecip:IngredientInRecip, action:Constants){

    if(action==Constants.ADD){
       this.perUnitCost= ingInRecip.qty*ingInRecip.brandForIngredient.perUnitCost + this.perUnitCost;

    }else if(action==Constants.REMOVE){
      this.perUnitCost=  this.perUnitCost - ingInRecip.qty*ingInRecip.brandForIngredient.perUnitCost;
    }

  }


  calculateCostTotal() {
 /*   if(fromDisplay){

      this.totalCost = 0;
      this.recipe.ingredientInRecipe.forEach(value => {

        this.totalCost = this.totalCost + value.costTotal;
      });

      return;
    }
*/
/*


    if(!this.enableUpdateTotal)
      return;

*/

    this.perUnitCost = 0;
    this.addIngMap.forEach((value, key) => {
      this.perUnitCost = this.perUnitCost + value.costTotal;
    });
    this.addSubRecipeMap.forEach((value, key) => {
      this.totalCost = this.totalCost + value.costTotal;
    });
  }

  calculateIngCostForRecipe(ingInRecipe: IngredientInRecip, fromDisplay: boolean = false){

    ingInRecipe.getIngCostForRecipe()

    this.calculateCostTotal();
  }





}
