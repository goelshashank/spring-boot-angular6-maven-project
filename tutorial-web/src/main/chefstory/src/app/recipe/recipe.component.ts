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
import {Editor, Toolbar} from "ngx-editor";
import {RouterService} from "../service/router.service";
import {ActivatedRoute} from "@angular/router";
import {RouterPaths} from "../config/RouterPaths";
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';

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
  sortRecipesBy: string = null;
  enableAdj=false;
  enableUpdateTotal=true;
  protected readonly RouterPaths = RouterPaths;

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

  constructor(private http: HttpClient, public appComponent: AppComponent
              ,private routerService:RouterService, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
    this.editor2.destroy();
  }

  ngOnInit(): void {
    this.refresh(true,false,true);
    this.sortRecipes('category');
    console.log("++++ Initialized Recipes +++");
  }

  refresh(showRecipe:boolean,toUpdate:boolean,refreshCache:boolean): void {
    if(refreshCache) this.appComponent.refreshAppCache();
    if (this.addRecipeForm != null) this.addRecipeForm.reset();
    this.addIngMap= new Map<number, IngredientInRecip>();
    this.addSubRecipeMap= new Map<number, IngredientInRecip>();
    this.totalCost=0;
    this.displayRecipeInfo = new Recipe();
    this.showRecipe=showRecipe;
    this.toUpdate=toUpdate;
    this.editor = new Editor();
    this.editor1=new Editor();
    this.editor2=new Editor();
  }

  addRecipes() {

    this.addRecipe.recipe.ingredientInRecipe = Array.from(this.addIngMap.values());
    Array.from( this.addSubRecipeMap.values()).forEach((value)=> this.addRecipe.recipe.ingredientInRecipe.push(value));

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (this.addRecipeForm.valid) {
     // console.log('Add recipe list: ' + JSON.stringify(addRecipeList));
    }

    let api:string=null;

    if(!this.toUpdate)
      api=ApiPaths.AddRecipes;
    else
      api=ApiPaths.UpdateRecipes;

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
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
       // alert('%% add recipe is completed successfully %%');
      });

    this.reload();
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
     addIngredient.ingredient.catList=[this.appComponent.getMainCategoriesFor(addIngredient.ingredient.categoriesForIngredient)[0].category.title];

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
    addSubRecipe.subRecipe.catList=[this.appComponent.getMainCategoriesFor(addSubRecipe.subRecipe.categoriesForRecipe)[0].category.title];
    addSubRecipe.subRecipe.subCatList=[this.appComponent.getSubCategoriesFor(addSubRecipe.subRecipe.categoriesForRecipe)[0].category.title];

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
  setCategories(t: Category,isSub:boolean) {

    let title=this.appComponent.getTitle(t);

    if (!this.addRecipe.recipe.categoriesForRecipe.map((o) => o.category.title).includes(title)) {
      let u: CategoryFor = new CategoryFor();
      u.category = new Category();
      u.category.title = title;
      u.category.type = Constants.RECIPE;
      u.category.isSub=isSub;
      this.addRecipe.recipe.categoriesForRecipe.push(u);
    }

    console.log('Added: recipe Categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }

  removeCategories(t: Category,isSub:boolean) {
    let title=this.appComponent.getTitle(t);

    this.addRecipe.recipe.categoriesForRecipe = this.addRecipe.recipe.categoriesForRecipe.filter(({ category }) => category.title != title);

    console.log('Removed: recipe categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }

  getRecipe(recipe: Recipe) {
    this.http.post<Recipe[]>(environment.baseUrl + ApiPaths.GetRecipes, Array.of(recipe)).subscribe(
      (response) => {
        this.displayRecipeInfo = response[0];
       // console.log('Recipe - ' + JSON.stringify(this.displayRecipeInfo));
      },
      (error) => {
        console.log('Error happened in getting recipe' + JSON.stringify(error));
      },
      () => {
        console.log('%% get recipe is completed successfully %%');
      });
    this.refresh(true,false,false);
  }

  onUpdate(){

    this.showRecipe=false;
    this.toUpdate=true;

    this.addRecipe=new AddRecipe();
    this.addRecipe.recipe=this.displayRecipeInfo;
    console.log('Updating Recipe - ' + JSON.stringify(this.addRecipe.recipe))

    this.addRecipe.recipe.catList=this.appComponent.getMainCategoriesFor(this.displayRecipeInfo.categoriesForRecipe).map((t)=> t.category.title);
    this.addRecipe.recipe.subCatList=this.appComponent.getSubCategoriesFor(this.displayRecipeInfo.categoriesForRecipe).map((t)=> t.category.title);
    this.addRecipe.recipe.ingList=this.displayRecipeInfo.ingredientInRecipe.filter((u)=>u.ingredient!=null)
      .map((t)=> t.ingredient.title);
    this.addRecipe.recipe.subRecipeList=this.displayRecipeInfo.ingredientInRecipe.filter((u)=> u.subRecipe!=null)
      .map((t)=> t.subRecipe.title);
    this.addIngMap=new Map<number, IngredientInRecip>();
   // console.log('Ingredients in Recipe - ' + JSON.stringify(this.displayRecipeInfo.ingredientInRecipe))
    this.displayRecipeInfo.ingredientInRecipe.forEach((o)=>{
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


  sortRecipes(type: string) {
    this.sortRecipesBy = type;
    if (type == 'category') {
      this.appComponent.sortRecipesByCategory(this.appComponent.recipes)
    }
  }


  remove() {
    let addRecipe: AddRecipe = new AddRecipe();
    addRecipe.recipe = this.displayRecipeInfo;

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
        console.log('%% remove recipe is completed successfully %%');
        //  alert('%% add recipe is completed successfully %%');
      });
    this.reload();
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
    window.location.reload()
  }
}
