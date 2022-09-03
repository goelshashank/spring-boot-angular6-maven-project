import {Component, Injectable, OnInit} from '@angular/core';
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
export class RecipeComponent implements OnInit {

  addRecipe: AddRecipe = new AddRecipe();
  title = 'recipe';
  recipe: Recipe = new Recipe();
  addIngMap: Map<number, IngredientInRecip> = new Map<number, IngredientInRecip>();
  totalCost: number;
  displayRecipeInfo: Recipe = new Recipe();
  showRecipe = true;
  addARecipe = false;


  constructor(private http: HttpClient, public appComponent: AppComponent,private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
   this.recipe = new Recipe();
    this.addIngMap= new Map<number, IngredientInRecip>();
    this.totalCost=0;
    this.displayRecipeInfo = new Recipe();
  }


  addRecipes(form: NgForm) {

    this.addRecipe.recipe.ingredientInRecipe = Array.from(this.addIngMap.values());
    this.addRecipe.recipe = this.recipe;

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid) {
      console.log('Add recipe list: ' + JSON.stringify(addRecipeList));
    }

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened' + JSON.stringify(error));
      },
      () => {
        console.log(' %% add recipe call is completed successfully %%');
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
    console.log('Ing comp list' + JSON.stringify(Array.from(this.addIngMap.values())));
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
  }

  addBrand(brandForIngredient: BrandForIngredient, ing: Ingredient) {
    let addBrand: BrandForIngredient = new BrandForIngredient();
    addBrand.brand = brandForIngredient.brand;
    this.addIngMap.get(ing.id).ingredient.brandForIngredients = [];
    this.addIngMap.get(ing.id).ingredient.brandForIngredients.push(addBrand);
  }

  addCategory(categoryFor: CategoryFor, ing: Ingredient) {
    let addCategory: CategoryFor = new CategoryFor();
    addCategory.category = categoryFor.category;
    this.addIngMap.get(ing.id).ingredient.categoriesForIngredient = new Array(0);
    this.addIngMap.get(ing.id).ingredient.categoriesForIngredient.push(addCategory);
  }


  setCategories(categories: Category[]) {
    categories.forEach(t => {
      let addCategory: CategoryFor = new CategoryFor();
      addCategory.category = t;
      addCategory.category.title = t.label;
      addCategory.category.type = Constants.RECIPE;
      this.addRecipe.recipe.categoriesForRecipe.push(addCategory);
    });

    console.log('recipe Categories  list' + JSON.stringify(Array.from(this.addRecipe.recipe.categoriesForRecipe)));

  }


  getRecipe(recipe: Recipe) {
    this.toggleRecipeDiag(true, false);
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

  toggleRecipeDiag(showRecipe: boolean, addARecipe: boolean) {

    this.ngOnInit();
    console.log("show recipe value - "+showRecipe);
    this.showRecipe = showRecipe;
    this.addARecipe = addARecipe;

  }

}
