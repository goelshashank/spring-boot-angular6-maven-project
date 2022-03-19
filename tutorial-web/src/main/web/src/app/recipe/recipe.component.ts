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
import {Category} from "../model/Category";
import {AddCategory} from "../model/AddCategory";
import {Constants} from "../config/Constants";
import {Supplier} from "../model/Supplier";
import {Brand} from "../model/Brand";

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

   addSupplier(supplier: Supplier) {
    let addSupplier:AddSupplier=new AddSupplier();
    addSupplier.supplier=supplier;
    this.addIngMap.get(addSupplier.id).addSuppliers[0] = addSupplier;
  }

   addBrand(brand: Brand) {
    let addBrand:AddBrand=new AddBrand();
    addBrand.brand=brand;
    this.addIngMap.get(addBrand.id).addBrands[0] = addBrand;
  }
   addCategory(category: Category) {
    let addCategory:AddCategory=new AddCategory();
    addCategory.category=category;
    this.addIngMap.get(addCategory.id).addCategories[0] = addCategory;
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
}
