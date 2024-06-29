import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {StoreComponent} from '../store.component';
import {Category} from '../model/Category';
import {Constants} from '../config/Constants';
import {SupplierForIngredient} from '../model/SupplierForIngredient';
import {BrandForIngredient} from '../model/BrandForIngredient';
import {CategoryFor} from '../model/CategoryFor';
import { IngredientInRecip } from '../model/IngredientInRecip';
import {BaseModel} from "../model/BaseModel";
import {Editor, Toolbar} from "ngx-editor";
import {RouterService} from "../service/router.service";
import {ActivatedRoute} from "@angular/router";
import {RouterPaths} from "../config/RouterPaths";
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';
import {delay, retryWhen} from "rxjs";
import {environment} from "../../../environments/environment";
import {Flow} from "../utils/Flow";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
  providers: [RouterService]
})
@Injectable()
export class RecipeComponent implements OnInit , OnDestroy {

  name = 'recipe';
  totalCost: number=0;
  recipe: Recipe = new Recipe(null);
  showRecipe = true;
  toUpdate: boolean = false;
  sortRecipesBy: string = null;
  enableAdj=false;
  enableUpdateTotal=true;
  protected readonly RouterPaths = RouterPaths;
  enableDisplayAdjust=false;

  editor: Editor;
  editor1: Editor;
  editor2: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  html: '';
  @ViewChild ('addRecipeForm') addRecipeForm: NgForm;

  constructor(private http: HttpClient, public appComponent: StoreComponent
              ,private routerService:RouterService, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.appComponent.isRecipeActive=false;
    this.editor.destroy();
    this.editor1.destroy();
    this.editor2.destroy();
  }

  ngOnInit(): void {
    this.refresh(Flow.ON_INIT);
    this.refresh(true, false, true);
    this.sortRecipes('category');
    this.appComponent.isRecipeActive=true; //todo: to come back
    console.log("++++ Initialized Recipes +++");
  }

  refresh(flow: Flow): void {
    // showRecipe: boolean, toUpdate: boolean, refreshCache: boolean, toUpdateCost: boolean = false
    if(refreshCache) this.appComponent.refreshAppCache();
    if (!showRecipe && (this.addRecipeForm != null && toUpdateCost)) {
       this.addRecipeForm.reset();
       this.addRecipeForm=null;
      this.recipe = new Recipe(null);
    }

      if(!toUpdateCost) this.totalCost = 0;
      this.toUpdate=toUpdate;
      this.editor = new Editor();
      this.editor1=new Editor();
      this.editor2=new Editor();
      this.enableDisplayAdjust=false;

     // alert(this.displayRecipeInfo.title)
    this.showRecipe=showRecipe;

  }

  addRecipes() {

    let addRecipeList: Recipe[] = [this.recipe];
    let title=this.recipe.title;

    if (this.addRecipeForm.valid) {
     // console.log('Add recipe list: ' + JSON.stringify(addRecipeList));
    }

    let api:string=!this.toUpdate?ApiPaths.AddRecipes:ApiPaths.UpdateRecipes;

    this.http.post(environment.baseUrl + api, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -' + JSON.stringify(response));
       // alert('Add recipes response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened' + JSON.stringify(error));
        alert('Error happened in add recipe' + JSON.stringify(error));
      },
      () => {
        console.log(' %% add recipe is completed successfully %%');
        let recipe:Recipe=new Recipe(null);
        recipe.title=title;
        this.getRecipe(recipe);
        // alert('%% add recipe is completed successfully %%');
      });

   // this.reload();
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

 /* setRecipeCategory(categoryFor: CategoryFor, recipe: Recipe) {
    if(categoryFor==null) {
      this.addSubRecipeMap.get(recipe.id).category = null;
      return;
    }

    this.addSubRecipeMap.get(recipe.id).category=categoryFor.category;
  }
*/

  getRecipe(recipe: Recipe) {
    this.http.post<Recipe[]>(environment.baseUrl + ApiPaths.GetRecipes, Array.of(recipe)).pipe(
      retryWhen(errors =>
        errors.pipe(
          //todo: improve retry logic
          delay(1000)
        )
      )
    )
    .subscribe(
      (response) => {
        this.recipe = response[0];
       // console.log('Recipe - ' + JSON.stringify(this.displayRecipeInfo));
      },
      (error) => {
        console.log('Error happened in getting recipe' + JSON.stringify(error));
      },
      () => {
        this.onUpdate(false);
        this.calculateCostTotal();
       // alert("++"+this.displayRecipeInfo.title)
        this.refresh(true, false, true, true);
        console.log('%% get recipe is completed successfully %%');
      });

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

  skipCurrentRecipe(recipes:Recipe[]){
   if(this.recipe==null)
     return recipes;

   return recipes.filter((t)=> t.title!=this.recipe.title);
  }


  remove() {
    let addRecipe: Recipe = new Recipe(null);

    this.http.post(environment.baseUrl + ApiPaths.RemoveRecipes, [addRecipe]).subscribe(
      (response) => {
        console.log('remove recipes response -' + JSON.stringify(response));
        // alert('Add recipes response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in remove recipe' + JSON.stringify(error));
        // alert('Error happened in remove recipe' + JSON.stringify(error));
      },
      () => {
        this.reload();
        console.log('%% remove recipe is completed successfully %%');
        //  alert('%% add recipe is completed successfully %%');
      });

  }

  exportRecipes(): void {
    const workbook = XLSX.utils.book_new();

    const recipes: Recipe []=  this.appComponent.recipes;

    const data: any[][] = [];
    let i = 0;
    recipes.forEach(rcp=>{
      const headerRow = ['Title', 'Category', 'Source','Source URL','Method','Notes','Prep Time','Rating','Unit',
      'Cook Time','Course','Instructions','Shelf Life','Serving Qty','Unit Detailed'];
       data[++i] = headerRow;
      const values = [ rcp.title, rcp.categoriesForRecipe[0].category.title,rcp.source,rcp.sourceURL,rcp.method,rcp.notes,
      rcp.prepTime,rcp.rating,rcp.unit,rcp.cookTime,rcp.course,rcp.instructions,rcp.shelfLife,rcp.servingQty,rcp.unitDetailed];
      data[++i] = values;
      const headerRow2 = ['INGREDIENTS'];
      data[++i] = headerRow2;
      const headerRow3 = ['S.No.', 'Title', 'Category', 'Supplier', 'Brand [SKU Cost|SKU Qty]','GST%','Minimum Inventory','Unit'];
      data[++i] = headerRow3;

      const pojoList: IngredientInRecip[] = rcp.ingredientInRecipe;
      pojoList.forEach((k,index) => {
        let t=k.ingredient;
        let brandStr='';
        t.brandForIngredients.forEach((u,index)=>{
          const s=t.brandForIngredients[index].brand.title + '['+t.brandForIngredients[index].skuCost+'|'+
            t.brandForIngredients[index].skuQty+']';
          if(index==0){
            brandStr=s;
          }else{
            brandStr=brandStr +','+ s;
          }
        });
        let suppStr='';
        t.supplierForIngredients.forEach((u,index)=>{
          const s=t.supplierForIngredients[index].supplier.title;
          if(index==0){
            suppStr=s;
          }else{
            suppStr=suppStr +','+ s;
          }
        });

        const values = [++index, t.title, t.categoriesForIngredient[0].category.title, suppStr,
          brandStr,t.gst,t.minimumInventory,t.unit];
        data[++i] = values;
      });

      data[++i]=[];

    })

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {type: 'buffer', bookType: 'xlsx'});
    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});

    FileSaver.saveAs(blob, 'RecipesList.xlsx');
  }

  importRecipes(): void {

  }

  reload(){
    //window.location.reload();
    this.refresh(true, false, true);
  }

}
