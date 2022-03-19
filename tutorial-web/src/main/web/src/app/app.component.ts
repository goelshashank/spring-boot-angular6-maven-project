import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ApiPaths} from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';
import {AppConfiguration} from './model/AppConfiguration';
import {Supplier} from './model/Supplier';
import {Brand} from './model/Brand';
import {Category} from "./model/Category";
import {Constants} from "./config/Constants";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {

  title = 'homepage';
  ingredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  suppliers: Supplier[] = [];
  brands: Brand[] = [];
  categories:Category[]=[];
  categoriesRecipe:Category[]=[];
  categoriesIngredient:Category[]=[];
  appConfiguration: AppConfiguration = new AppConfiguration();
  isShowAddIng = false;
  isShowAddRecipe = false;
  isDisplayAll = true;
  displayRecipeInfo:Recipe=new Recipe();
  displayIngredientInfo:Ingredient=new Ingredient();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.refreshAppCache();
  }

  showRecipeTab() {
    this.isShowAddRecipe = true;
    this.isShowAddIng = false;
    this.isDisplayAll = false;
  }

  showIngredientTab() {
    this.isShowAddIng = true;
    this.isShowAddRecipe = false;
    this.isDisplayAll = false;
  }

  showDisplayAllTab() {
    this.isDisplayAll = true;
    this.isShowAddRecipe = false;
    this.isShowAddIng = false;
  }

  getAllRecipes() {
    this.http.get<Recipe[]>(environment.baseUrl + ApiPaths.GetAllRecipes).subscribe(
      (response) => {
        this.recipes = response;
        console.log('Recipes - ' + JSON.stringify(this.recipes));
      },
      (error) => {
        console.log('Error happened in get all recipes' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all recipes is completed successfully %%');
      });
    return this.recipes;
  }

  getAllIngredients() {
    this.http.get<Ingredient[]>(environment.baseUrl + ApiPaths.GetAllIngredients).subscribe(
      (response) => {
        this.ingredients = response;
        console.log('Ingredients - ' + JSON.stringify(this.ingredients));
      },
      (error) => {
        console.log('Error happened  in get all ingredients' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all ingredients is completed successfully %%');
      });return this.ingredients;
  }

  getAllSuppliers() {
    this.http.get<Supplier[]>(environment.baseUrl + ApiPaths.GetAllSuppliers).subscribe(
      (response) => {
        this.suppliers = response;
        console.log('suppliers - ' + JSON.stringify(this.suppliers));
      },
      (error) => {
        console.log('Error happened  in get all suppliers' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all suppliers is completed successfully %%');
      });return this.suppliers;
  }


  getAllBrands() {
    this.http.get<Brand[]>(environment.baseUrl + ApiPaths.GetAllBrands).subscribe(
      (response) => {
        this.brands = response;
        console.log('Brands - ' + JSON.stringify(this.brands));
      },
      (error) => {
        console.log('Error happened  in get all brands' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all brands is completed successfully %%');
      });return this.brands;
  }

  getAllCategories() {
    this.http.get<Category[]>(environment.baseUrl + ApiPaths.GetAllCategories).subscribe(
      (response) => {
        this.categories = response;
        this.categoriesRecipe=this.categories.filter(t=>{
         return t.type==Constants.RECIPE;
        })
        this.categoriesIngredient=this.categories.filter(t=>{
          return t.type==Constants.INGREDIENT;
        })
        console.log('categories - ' + JSON.stringify(this.categories));
      },
      (error) => {
        console.log('Error happened  in get all categories' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all categories is completed successfully %%');
      });
  }


  getConfiguration() {
    this.http.get<AppConfiguration>(environment.baseUrl + ApiPaths.GetConfig).subscribe(
      (response) => {
        this.appConfiguration = response;
        console.log('AppConfiguration - ' + JSON.stringify(this.appConfiguration));
      },
      (error) => {
        console.log('Error happened in get configuration' + JSON.stringify(error));
      },
      () => {
        console.log('%% get configuration is completed successfully %%');
      });
  }

  refreshAppCache() {
    this.getConfiguration();
    this.getAllIngredients();
    this.getAllRecipes();
    this.getAllSuppliers();
    this.getAllBrands();
    console.log(' --------  App cache refreshed ---------');
  }


  getRecipe(recipe:Recipe){
    this.http.post<Recipe[]>(environment.baseUrl + ApiPaths.GetRecipes,Array.of(recipe)).subscribe(
      (response ) => {
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

  getIngredient(ing:Ingredient){
    this.http.post<Map<number,Ingredient>>(environment.baseUrl + ApiPaths.GetIngredients,Array.of(ing)).subscribe(
      (response: Map<number,Ingredient>) => {
        this.displayIngredientInfo = response.get(ing.id);
        console.log('Ingredient - ' + JSON.stringify(this.displayIngredientInfo));
      },
      (error) => {
        console.log('Error happened in getting Ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%% get Ingredient is completed successfully %%');
      });
  }

  uploadImage(file:File){
    const formData: FormData = new FormData();

    formData.append('file', file);

    this.http.post(environment.baseUrl + ApiPaths.Upload, formData).subscribe(
      (response) => {
        console.log('Upload image response-' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in uploading image' + JSON.stringify(error));
      },
      () => {
        console.log('%% uploading image is completed successfully %%');
      });
  }

}
