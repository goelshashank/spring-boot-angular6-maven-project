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

  addIngredient(ing:Ingredient){

    let addIngredient: IngredientInRecip = new IngredientInRecip(ing,null);

    if (this.addIngMap.get(ing.title) != null) {
      addIngredient = this.addIngMap.get(ing.title);
    } else {
      addIngredient.ingredient = ing;
    }

    this.addIngMap.set(ing.title, addIngredient);
    if(!this.ingredientInRecipe.map((o) => o.ingredient.title).includes(ing.title)) this.ingredientInRecipe.push(new IngredientInRecip(ing,null))
    console.log('After addition, Ingredients in Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(addIngredient,Constants.ADD);

    // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
  }

  removeIngredient(ing:Ingredient) {

    let addIngredient: IngredientInRecip = this.addIngMap.get(ing.title)
    this.addIngMap.delete(ing.title);

    this.ingredientInRecipe = this.ingredientInRecipe.filter(({ingredient}) => ingredient.title != ing.getTitle(ing));
    console.log('After removal, ingredients in Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(addIngredient,Constants.REMOVE);
  }

  addSubRecipe(recipe:Recipe){
    let addIngredient: IngredientInRecip = new IngredientInRecip(null,recipe);

    if (this.addIngMap.get(recipe.title) != null) {
      addIngredient = this.addIngMap.get(recipe.title);
    } else {
      addIngredient.recipe = recipe;
    }

    this.addIngMap.set(recipe.title, addIngredient);
    if(!this.ingredientInRecipe.map((o) => o.subRecipe.title).includes(recipe.title)) this.ingredientInRecipe.push(new IngredientInRecip(null,recipe))
    console.log('After addition, Sub recipe- ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(addIngredient,Constants.ADD);
  }

  removeSubRecipe(recipe:Recipe) {
    let addIngredient: IngredientInRecip = this.addIngMap.get(recipe.title)
    this.addSubRecipeMap.delete(recipe.title);

    this.ingredientInRecipe = this.ingredientInRecipe.filter(({recipe}) => recipe.title != recipe.getTitle(recipe));
    console.log('After removal,sub Recipe - ' + JSON.stringify(Array.from(this.ingredientInRecipe)));
    this.calculateCost(addIngredient,Constants.REMOVE);
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
      this.sortRecipesByCategory(this.appComponent.recipes)
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



  onUpdate(toSetShowRecipe: boolean = true){

    console.time('Execution time of update recipe');
    this.toUpdate=true;

    this.recipe=new Recipe(null);
    this.recipe.refServingQty=null
    // console.log('Updating Recipe - ' + JSON.stringify(this.addRecipe.recipe))

    this.recipe.catList=this.appComponent.getMainCategoriesFor(this.recipe.categoriesForRecipe).map((t)=> t.category.title);
    this.recipe.subCatList=this.appComponent.getSubCategoriesFor(this.recipe.categoriesForRecipe).map((t)=> t.category.title);
    this.recipe.ingList=this.recipe.ingredientInRecipe.filter((u)=>u.ingredient!=null)
      .map((t)=> t.ingredient.title);
    this.recipe.subRecipeList=this.recipe.ingredientInRecipe.filter((u)=> u.subRecipe!=null)
      .map((t)=> t.subRecipe.title);
    this.addIngMap=new Map<number, IngredientInRecip>();
    // console.log('Ingredients in Recipe - ' + JSON.stringify(this.displayRecipeInfo.ingredientInRecipe))
    this.recipe.ingredientInRecipe.forEach((o)=>{
      if(o.ingredient!=null) {

        this.addIngMap.set(o.ingredient.id, o);
        this.calculateIngCostForRecipe(o);

        o.ingredient.catList = this.appComponent.getMainCategoriesFor(o.ingredient.categoriesForIngredient).map((t) => t.category.title);
        o.ingredient.supplierList = o.ingredient.supplierForIngredients.map((t) => t.supplier.title);
        o.ingredient.brandList = o.ingredient.brandForIngredients.map((t) => t.brand.title)
      }else if(o.subRecipe!=null){
        this.addSubRecipeMap.set(o.subRecipe.id,o);
        this.calculateIngCostForRecipe(o);

        o.subRecipe.catList = this.appComponent.getMainCategoriesFor(o.subRecipe.categoriesForRecipe).map((t) => t.category.title);
        o.subRecipe.subCatList = this.appComponent.getSubCategoriesFor(o.subRecipe.categoriesForRecipe).map((t) => t.category.title);
      }

    });
    this.enableAdj=false;
    this.enableUpdateTotal=true;
    this.appComponent.sleep(5)
    if(toSetShowRecipe) this.showRecipe=false;


    console.timeEnd('Execution time of update recipe');
    // console.log("-- update button action completed");
  }


  fixAndEnableAdjusting(u: any, fromDisplay: boolean = false){
    if(fromDisplay){
      this.enableAdj=u.target.checked;
      this.changeRef(null,fromDisplay);

      return;
    }


    this.enableAdj=u.target.checked;
    this.changeRef(null);
  }

  changeRef(t: any, fromDisplay: boolean = false) {

    if(fromDisplay){
      if (t == null) {

        this.recipe.refServingQty = this.recipe.servingQty;
        // alert( this.displayRecipeInfo.refServingQty)
        this.recipe.ingredientInRecipe.forEach(value => {
          value.refQty = value.qty;
        });
      }

      return;

    }

    if (t == null) {
      this.recipe.refServingQty = this.recipe.servingQty;

      this.addIngMap.forEach((value, key) => {
        value.refQty = value.qty;
      });
    }
  }

  adjustIng(fromDisplay: boolean = false){
    if(fromDisplay){

      if(!this.enableAdj)
        return;

      this.enableUpdateTotal=false;
      this.recipe.ingredientInRecipe.forEach(value=> {
        value.qty=value.refQty*( this.recipe.servingQty/this.recipe.refServingQty)
        this.calculateIngCostForRecipe(value,fromDisplay);
      });

      this.enableUpdateTotal=true;
      this.calculateCostTotal(fromDisplay);

      return;
    }



    if(!this.enableAdj)
      return;

    this.enableUpdateTotal=false;
    this.addIngMap.forEach((value, key) => {
      value.qty=value.refQty*( this.recipe.servingQty/this.recipe.refServingQty)
      this.calculateIngCostForRecipe(value);
    });

    this.enableUpdateTotal=true;
    this.calculateCostTotal();

  }

  calculateCost(ingInRecip:IngredientInRecip, action:Constants){

    if(action==Constants.ADD){
       this.perUnitCost= ingInRecip.brandForIngredient.perUnitCost + this.perUnitCost;

    }else if(action==Constants.REMOVE){
      this.perUnitCost=  this.perUnitCost - ingInRecip.brandForIngredient.perUnitCost;
    }


  }



  calculateCostTotal(fromDisplay: boolean = false) {
    if(fromDisplay){
      /*

            if(!this.enableUpdateTotal)
              return;
      */

      this.totalCost = 0;
      this.recipe.ingredientInRecipe.forEach(value => {

        this.totalCost = this.totalCost + value.costTotal;
      });

      return;
    }



    if(!this.enableUpdateTotal)
      return;


    this.totalCost = 0;
    this.addIngMap.forEach((value, key) => {
      this.totalCost = this.totalCost + value.costTotal;
    });
    this.addSubRecipeMap.forEach((value, key) => {
      this.totalCost = this.totalCost + value.costTotal;
    });
  }

  calculateIngCostForRecipe(ingInRecipe: IngredientInRecip, fromDisplay: boolean = false){

    if(ingInRecipe.ingredient!=null){
      ingInRecipe.costTotal = (ingInRecipe.ingredient.brandForIngredients.filter(t=> t.brand.id==ingInRecipe.brand.id)[0]
        .perUnitCost * ingInRecipe.qty);
    }else {

      let totalIngCost:number=0;

      //todo: to optimize this, either pre store during adding ingredient or calculate once while adding recipe.
      ingInRecipe.subRecipe.ingredientInRecipe.forEach((u)=> {

          if(u.ingredient!=null)
            totalIngCost =totalIngCost +  (u.ingredient
              .brandForIngredients.filter(t=> t.brand.id==u.brand.id)[0].perUnitCost * ingInRecipe.qty)
          else {
            u.subRecipe.ingredientInRecipe.forEach((t)=>this.calculateIngCostForRecipe(t));
          }
        }
      )
      ingInRecipe.costTotal=(totalIngCost/ingInRecipe.subRecipe.servingQty)*ingInRecipe.qty;
    }

    this.calculateCostTotal(fromDisplay);
  }





}
