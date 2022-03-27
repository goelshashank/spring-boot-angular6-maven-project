import {Component, Injectable, OnInit} from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';
import {AddIngredient} from '../model/AddIngredient';
import {AddSupplier} from '../model/AddSupplier';
import {AddBrand} from '../model/AddBrand';
import {Category} from '../model/Category';
import {AddCategory} from '../model/AddCategory';
import {Constants} from '../config/Constants';
import {SupplierForIngredient} from '../model/SupplierForIngredient';
import {BrandForIngredient} from '../model/BrandForIngredient';
import {CategoryFor} from '../model/CategoryFor';

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
  addIngMap: Map<number, AddIngredient> = new Map<number, AddIngredient>();
  totalCost: number;
  displayRecipeInfo: Recipe = new Recipe();
  showRecipe = true;
  addARecipe = false;


  constructor(private http: HttpClient, public appComponent: AppComponent) {
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
  }


  addRecipes(form: NgForm) {

    this.addRecipe.addIngredients = Array.from(this.addIngMap.values());
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

    let ingCompMap: Map<number, AddIngredient> = new Map<number, AddIngredient>();
    ingList.forEach(t => {
      let addIngredient: AddIngredient = new AddIngredient();
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

  async calculateCostTotal() {
    this.totalCost = 0;
    this.addIngMap.forEach((value, key) => {
      this.totalCost = this.totalCost + (value.ingredient.perUnitCost * value.ingredient.quantityUnit);
    });
  }

  addSupplier(supplierForIngredient: SupplierForIngredient, ing: Ingredient) {
    let addSupplier: AddSupplier = new AddSupplier();
    addSupplier.supplier = supplierForIngredient.supplier;
    this.addIngMap.get(ing.id).addSuppliers = new Array(0);
    this.addIngMap.get(ing.id).addSuppliers.push(addSupplier);
  }

  addBrand(brandForIngredient: BrandForIngredient, ing: Ingredient) {
    let addBrand: AddBrand = new AddBrand();
    addBrand.brand = brandForIngredient.brand;
    this.addIngMap.get(ing.id).addBrands = new Array(0);
    this.addIngMap.get(ing.id).addBrands.push(addBrand);
  }

  addCategory(categoryFor: CategoryFor, ing: Ingredient) {
    let addCategory: AddCategory = new AddCategory();
    addCategory.category = categoryFor.category;
    this.addIngMap.get(ing.id).addCategories = new Array(0);
    this.addIngMap.get(ing.id).addCategories.push(addCategory);
  }


  setCategories(categories: Category[]) {
    categories.forEach(t => {
      let addCategory: AddCategory = new AddCategory();
      addCategory.category = t;
      addCategory.category.title = t.label;
      addCategory.category.type = Constants.RECIPE;
      this.addRecipe.addCategories.push(addCategory);
    });

    console.log('recipe Categories  list' + JSON.stringify(Array.from(this.addRecipe.addCategories)));

  }


  getRecipe(recipe: Recipe) {
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
    this.toggleRecipeDiag(true, false);
  }

  toggleRecipeDiag(showRecipe: boolean, addARecipe: boolean) {
    this.ngOnInit();

    this.showRecipe = showRecipe;
    this.addARecipe = addARecipe;

  }

}
