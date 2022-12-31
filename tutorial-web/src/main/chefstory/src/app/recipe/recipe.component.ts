import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';
import {Category} from '../model/Category';
import {Constants} from '../config/Constants';
import {SupplierForIngredient} from '../model/SupplierForIngredient';
import {BrandForIngredient} from '../model/BrandForIngredient';
import {CategoryFor} from '../model/CategoryFor';
import { AddIngredient } from '../model/AddIngredient';
import { IngredientInRecip } from '../model/IngredientInRecip';
import {BaseModel} from "../model/BaseModel";
import { Editor } from "ngx-editor";
import {RouterService} from "../service/router.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
  providers: [RouterService]
})
@Injectable()
export class RecipeComponent implements OnInit , OnDestroy {

  addRecipe: AddRecipe = new AddRecipe();
  name = 'recipe';
  addIngMap: Map<number, IngredientInRecip> = new Map<number, IngredientInRecip>();
  addSubRecipeMap: Map<number, IngredientInRecip> = new Map<number, IngredientInRecip>();
  totalCost: number=0;
  displayRecipeInfo: Recipe = new Recipe();
  showRecipe = true;
  toUpdate: boolean = false;
  enableAdj=false;
  enableUpdateTotal=true;

  editor: Editor;
  html: '';

  constructor(private http: HttpClient, public appComponent: AppComponent
              ,private routerService:RouterService, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    // this.addIngForm.reset();
    this.editor.destroy();
  }

  ngOnInit(): void {
    console.log("++++ Initialized Recipe +++");
    this.appComponent.refreshAppCache();
    this.addIngMap= new Map<number, IngredientInRecip>();
    this.addSubRecipeMap= new Map<number, IngredientInRecip>();
    this.totalCost=0;
    this.displayRecipeInfo = new Recipe();
    this.toUpdate=false;
    this.editor = new Editor();
  }

  @ViewChild ('addRecipeForm') addRecipeForm: NgForm;


  addRecipes(form: NgForm) {

    this.addRecipe.recipe.ingredientInRecipe = Array.from(this.addIngMap.values());
    Array.from( this.addSubRecipeMap.values()).forEach((value)=> this.addRecipe.recipe.ingredientInRecipe.push(value));

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid) {
      console.log('Add recipe list: ' + JSON.stringify(addRecipeList));
    }

    let api:string=null;

    if(!this.toUpdate)
      api=ApiPaths.AddRecipes;
    else
      api=ApiPaths.UpdateRecipes;

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -' + JSON.stringify(response));
        alert('Add recipes response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened' + JSON.stringify(error));
        alert('Error happened in add recipe' + JSON.stringify(error));
      },
      () => {
        console.log(' %% add recipe is completed successfully %%');
        alert('%% add recipe is completed successfully %%');
      });


    //------------------------
    form.reset();
    this.ngOnInit();
  }

  addIngredients(ing:Ingredient){
    let title=this.appComponent.getTitle(ing);
    let t:Ingredient=this.appComponent.getAllIngredients().filter(u=> u.title==title)[0];


    let addIngredient: IngredientInRecip = new IngredientInRecip();
    if (this.addIngMap.get(t.id) != null) {
      addIngredient = this.addIngMap.get(t.id);
    } else {
      addIngredient.ingredient = t;
    }

     addIngredient.qty = 1;
     addIngredient.ingredient.supplierList=[addIngredient.ingredient.supplierForIngredients[0].supplier.title];
     addIngredient.ingredient.brandList=[addIngredient.ingredient.brandForIngredients[0].brand.title];
     addIngredient.ingredient.catList=[addIngredient.ingredient.categoriesForIngredient[0].category.title];

     this.addIngMap.set(t.id, addIngredient);

     this.setSupplier(addIngredient.ingredient.supplierForIngredients[0],addIngredient.ingredient);
     this.setBrand(addIngredient.ingredient.brandForIngredients[0],addIngredient);
     this.setCategory(addIngredient.ingredient.categoriesForIngredient[0],addIngredient.ingredient);

    // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
  }

  removeIngredients(ing:Ingredient) {
    let title=this.appComponent.getTitle(ing);
    let t:Ingredient=this.appComponent.getAllIngredients().filter(u=> u.title==title)[0];

    this.addIngMap.delete(t.id);
    // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
    this.calculateCostTotal();
  }

  addSubRecipes(recipe:Recipe){
    let title=this.appComponent.getTitle(recipe);
    let t:Recipe=this.appComponent.getAllRecipes().filter(u=> u.title==title)[0];


    let addSubRecipe: IngredientInRecip = new IngredientInRecip();
    if (this.addSubRecipeMap.get(t.id) != null) {
      addSubRecipe = this.addSubRecipeMap.get(t.id);
    } else {
      addSubRecipe.subRecipe = t;
    }

    addSubRecipe.qty = 1;
    addSubRecipe.subRecipe.catList=[addSubRecipe.subRecipe.categoriesForRecipe[0].category.title];

    this.addSubRecipeMap.set(t.id, addSubRecipe);
/*
    this.setRecipeCategory(addSubRecipe.subRecipe.categoriesForRecipe[0],addSubRecipe.subRecipe);
*/

    // console.log('Sub Recipe comp list' + JSON.stringify(Array.from(this.addSubRecipeMap.values())));
  }

  removeSubRecipes(recipe:Recipe) {
    let title=this.appComponent.getTitle(recipe);
    let t:Recipe=this.appComponent.getAllRecipes().filter(u=> u.title==title)[0];

    this.addIngMap.delete(t.id);
    // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
    this.calculateCostTotal();
  }

  calculateCostTotal() {
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

  setSupplier(supplierForIngredient: SupplierForIngredient, ing: Ingredient) {
   if(supplierForIngredient==null) {
     this.addIngMap.get(ing.id).supplier = null;
    // console.log('Ing supplier removed - ' + JSON.stringify(Array.from(this.addIngMap.values())));
     return;
   }
    this.addIngMap.get(ing.id).supplier=supplierForIngredient.supplier;
   //  console.log('Ing supplier added - ' + JSON.stringify(Array.from(this.addIngMap.values())));
  }

  setBrand(brandForIngredient: BrandForIngredient, ingInRecipe: IngredientInRecip) {
    if (brandForIngredient == null) {
      this.addIngMap.get(ingInRecipe.ingredient.id).brand = null;
      return;
    }
    ingInRecipe.brand = brandForIngredient.brand;
    this.calculateIngCostForRecipe(ingInRecipe);
  }

  calculateIngCostForRecipe(ingInRecipe:IngredientInRecip){

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

    this.calculateCostTotal();
  }

  setCategory(categoryFor: CategoryFor, ing: Ingredient) {
    if(categoryFor==null) {
      this.addIngMap.get(ing.id).category = null;
      return;
    }

    this.addIngMap.get(ing.id).category=categoryFor.category;
  }

 /* setRecipeCategory(categoryFor: CategoryFor, recipe: Recipe) {
    if(categoryFor==null) {
      this.addSubRecipeMap.get(recipe.id).category = null;
      return;
    }

    this.addSubRecipeMap.get(recipe.id).category=categoryFor.category;
  }
*/
  setCategories(t: Category) {

    let title=this.appComponent.getTitle(t);

    if (!this.addRecipe.recipe.categoriesForRecipe.map((o) => o.category.title).includes(title)) {
      let u: CategoryFor = new CategoryFor();
      u.category = new Category();
      u.category.title = title;
      u.category.type = Constants.RECIPE;
      this.addRecipe.recipe.categoriesForRecipe.push(u);
    }

    console.log('Added: recipe Categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }

  removeCategories(t: Category) {
    let title=this.appComponent.getTitle(t);

    this.addRecipe.recipe.categoriesForRecipe = this.addRecipe.recipe.categoriesForRecipe.filter(({ category }) => category.title != title);

    console.log('Removed: recipe categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }

  getRecipe(recipe: Recipe) {
    this.toggleRecipeDiag(true);
    this.http.post<Recipe[]>(environment.baseUrl + ApiPaths.GetRecipes, Array.of(recipe)).subscribe(
      (response) => {
        this.displayRecipeInfo = response[0];
        console.log('Recipe - ' + JSON.stringify(this.displayRecipeInfo));
      },
      (error) => {
        console.log('Error happened in getting recipe' + JSON.stringify(error));
      },
      () => {
        console.log('%% get recipe is completed successfully %%');
      });

  }

  toggleRecipeDiag(showRecipe: boolean) {
    this.addRecipeForm.reset();
    this.ngOnInit();
    console.log("show recipe value - "+showRecipe);
    this.showRecipe = showRecipe;
  }

  onUpdate(){

    this.showRecipe=!this.showRecipe;
    this.toUpdate=true;

    this.addRecipe=new AddRecipe();
    this.addRecipe.recipe=this.displayRecipeInfo;

    this.addRecipe.recipe.catList=this.displayRecipeInfo.categoriesForRecipe.map((t)=> t.category.title);
    this.addRecipe.recipe.ingList=this.displayRecipeInfo.ingredientInRecipe.filter((u)=>u.ingredient!=null)
      .map((t)=> t.ingredient.title);
    this.addRecipe.recipe.subRecipeList=this.displayRecipeInfo.ingredientInRecipe.filter((u)=> u.subRecipe!=null)
      .map((t)=> t.subRecipe.title);
    this.addIngMap=new Map<number, IngredientInRecip>();
    console.log('Ingredients in Recipe - ' + JSON.stringify(this.displayRecipeInfo.ingredientInRecipe))
    this.displayRecipeInfo.ingredientInRecipe.forEach((o)=>{
      if(o.ingredient!=null) {

        this.addIngMap.set(o.ingredient.id, o);
        this.calculateIngCostForRecipe(o);

        o.ingredient.catList = o.ingredient.categoriesForIngredient.map((t) => t.category.title);
        o.ingredient.supplierList = o.ingredient.supplierForIngredients.map((t) => t.supplier.title);
        o.ingredient.brandList = o.ingredient.brandForIngredients.map((t) => t.brand.title)
      }else if(o.subRecipe!=null){
        this.addSubRecipeMap.set(o.subRecipe.id,o);
        this.calculateIngCostForRecipe(o);

        o.subRecipe.catList = o.subRecipe.categoriesForRecipe.map((t) => t.category.title);
      }

    });
    this.enableAdj=false;
    this.enableUpdateTotal=true;
    console.log("-- update button action completed");
  }



  fixAndEnableAdjusting(u:any){
    this.enableAdj=u.target.checked;
    this.changeRef(null);
  }

   changeRef(t:any) {
    if (t == null) {
      this.addRecipe.recipe.refServingQty = this.addRecipe.recipe.servingQty;

      this.addIngMap.forEach((value, key) => {
        value.refQty = value.qty;
      });
    }
  }

  adjustIng(){
    if(!this.enableAdj)
      return;

    this.enableUpdateTotal=false;
    this.addIngMap.forEach((value, key) => {
      value.qty=value.refQty*( this.addRecipe.recipe.servingQty/this.addRecipe.recipe.refServingQty)
      this.calculateIngCostForRecipe(value);
    });

    this.enableUpdateTotal=true;
    this.calculateCostTotal();

  }

  resetIngSelects(){
    this.addIngMap.forEach((value, key) => this.removeIngredients(value.ingredient));
  }

  resetSubRecipeSelects(){
    this.addSubRecipeMap.forEach((value, key) => this.removeSubRecipes(value.subRecipe));
  }

  skipCurrentRecipeFilter(recipes:Recipe[]){
   if(this.displayRecipeInfo==null)
     return recipes;

   return recipes.filter((t)=> t.title!=this.displayRecipeInfo.title);
  }


}
