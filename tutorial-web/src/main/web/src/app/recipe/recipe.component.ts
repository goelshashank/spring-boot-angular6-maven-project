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
import {ActivatedRoute, Router} from '@angular/router';
import { AddIngredient } from '../model/AddIngredient';
import { IngredientInRecip } from '../model/IngredientInRecip';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
@Injectable()
export class RecipeComponent implements OnInit , OnDestroy {

  addRecipe: AddRecipe = new AddRecipe();
  title = 'recipe';
  addIngMap: Map<number, IngredientInRecip> = new Map<number, IngredientInRecip>();
  totalCost: number=0;
  displayRecipeInfo: Recipe = new Recipe();
  showRecipe = true;
  toUpdate: boolean = false;


  constructor(private http: HttpClient, public appComponent: AppComponent,private router: Router, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    // this.addIngForm.reset();
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
    this.addIngMap= new Map<number, IngredientInRecip>();
    this.totalCost=0;
    this.displayRecipeInfo = new Recipe();
    this.toUpdate=false;
  }

  @ViewChild ('addRecipeForm') addRecipeForm: NgForm;


  addRecipes(form: NgForm) {
      console.log("test");
    this.addRecipe.recipe.ingredientInRecipe = Array.from(this.addIngMap.values());

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

  setIngredients(ingList: Ingredient[]) {

    let ingCompMap: Map<number, IngredientInRecip> = new Map<number, IngredientInRecip>();
    ingList.forEach(t => {
      let addIngredient: IngredientInRecip = new IngredientInRecip();
      if (this.addIngMap.get(t.id) != undefined) {
        addIngredient = this.addIngMap.get(t.id);
      } else {
        addIngredient.ingredient = t;
      }
      addIngredient.ingredient.quantityUnit = 1;
      ingCompMap.set(t.id, addIngredient);
    });
    this.addIngMap = ingCompMap;
   // console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
    this.calculateCostTotal();
  }

  calculateCostTotal() {
    this.totalCost = 0;
    this.addIngMap.forEach((value, key) => {
      this.totalCost = this.totalCost + (value.ingredient.brandForIngredients[0].perUnitCost * value.ingredient.quantityUnit);
    });
  }

  addSupplier(supplierForIngredient: SupplierForIngredient, ing: Ingredient) {
    let addSupplier: SupplierForIngredient = new SupplierForIngredient();
    addSupplier.supplier = supplierForIngredient.supplier;
    this.addIngMap.get(ing.id).ingredient.supplierForIngredients = [];
    this.addIngMap.get(ing.id).ingredient.supplierForIngredients.push(addSupplier);
    this.addIngMap.get(ing.id).supplier=addSupplier.supplier;
  }

  addBrand(brandForIngredient: BrandForIngredient, ing: Ingredient) {
    let addBrand: BrandForIngredient = new BrandForIngredient();
    addBrand.brand = brandForIngredient.brand;
    this.addIngMap.get(ing.id).ingredient.brandForIngredients = [];
    this.addIngMap.get(ing.id).ingredient.brandForIngredients.push(addBrand);
    this.addIngMap.get(ing.id).brand=addBrand.brand;
  }

  addCategory(categoryFor: CategoryFor, ing: Ingredient) {
    let addCategory: CategoryFor = new CategoryFor();
    addCategory.category = categoryFor.category;
    this.addIngMap.get(ing.id).ingredient.categoriesForIngredient = new Array(0);
    this.addIngMap.get(ing.id).ingredient.categoriesForIngredient.push(addCategory);
    this.addIngMap.get(ing.id).category=addCategory.category;
  }

  setCategories(t: Category) {

    let title=null;
    if(t.title!=null)
      title=t.title;
    else if(t.label!=null)
      title=t.label;
    else
      return;

    if (!this.addRecipe.recipe.categoriesForRecipe.map((o) => o.category.title).includes(title)) {
      let u: CategoryFor = new CategoryFor();
      u.category = new Category();
      u.category.title = title;
      u.category.type = Constants.INGREDIENT;
      this.addRecipe.recipe.categoriesForRecipe.push(u);
    }

    console.log('Added: recipe Categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }

  removeCategories(t: Category) {
    let title=null;
    if(t.title!=null)
      title=t.title;
    else if(t.label!=null)
      title=t.label;
    else
      return;

    this.addRecipe.recipe.categoriesForRecipe = this.addRecipe.recipe.categoriesForRecipe.filter(({ category }) => category.title != title);

    console.log('Removed: recipe categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));
  }


  getRecipe(recipe: Recipe) {
    this.toggleRecipeDiag(true);
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

  }

  toggleRecipeDiag(showRecipe: boolean) {
    this.addRecipeForm.reset();
    this.ngOnInit();
    console.log("show recipe value - "+showRecipe);
    this.showRecipe = showRecipe;
  }

  onUpdate(){

    this.showRecipe=!this.showRecipe;
    this.addRecipe=new AddRecipe();
    this.addRecipe.recipe=this.displayRecipeInfo;
    this.toUpdate=true;

    //  this.addIngForm.form.get("titleIng").setValue(this.displayIngInfo.title);
    this.addRecipeForm.form.get("categoryForRecipe").
    setValue(this.displayRecipeInfo.categoriesForRecipe.map((t)=> t.category.title));
    this.addRecipeForm.form.get("ingredientListForRecipe").
    setValue(this.displayRecipeInfo.ingredientInRecipe.map((t)=> t.ingredient.title));

  }

}
