import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ApiPaths} from './config/ApiPaths';
import {Recipe} from './model/Recipe';
import {Ingredient} from './model/Ingredient';
import {AppConfiguration} from './model/AppConfiguration';
import {Supplier} from './model/Supplier';
import {Brand} from './model/Brand';
import {Category} from './model/Category';
import {Constants} from './config/Constants';
import {BaseModel} from "./model/BaseModel";
import {RouterService} from "./service/router.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {RouterPaths} from "./config/RouterPaths";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RouterService]
})
@Injectable()
export class AppComponent implements OnInit {

  title = 'homepage';
  ingredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  suppliers: Supplier[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  categoriesRecipe: Category[] = [];
  categoriesIngredient: Category[] = [];
  appConfiguration: AppConfiguration = new AppConfiguration();
  displayIngredientInfo: Ingredient = new Ingredient();
  sidebarExpanded: boolean = false;
  currentRoute:string;

  constructor(private http: HttpClient,public routerService:RouterService, public route: ActivatedRoute,private router:Router) {

   // const currentRoute = this.route.snapshot.routeConfig.path;
  }

  ngOnInit(): void {
    this.refreshAppCache();
  }

  getAllRecipes() {
    this.http.get<Recipe[]>(environment.baseUrl + ApiPaths.GetAllRecipes).subscribe(
      (response) => {
        this.recipes = response;
      //  console.log('Recipes - ' + JSON.stringify(this.recipes));
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
    //    console.log('Ingredients - ' + JSON.stringify(this.ingredients));
      },
      (error) => {
        console.log('Error happened  in get all ingredients' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all ingredients is completed successfully %%');
      });
    return this.ingredients;
  }

  getAllSuppliers() {
    this.http.get<Supplier[]>(environment.baseUrl + ApiPaths.GetAllSuppliers).subscribe(
      (response) => {
        this.suppliers = response;
       // console.log('suppliers - ' + JSON.stringify(this.suppliers));
      },
      (error) => {
        console.log('Error happened  in get all suppliers' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all suppliers is completed successfully %%');
      });
    return this.suppliers;
  }


  getAllBrands() {
    this.http.get<Brand[]>(environment.baseUrl + ApiPaths.GetAllBrands).subscribe(
      (response) => {
        this.brands = response;
      //  console.log('Brands - ' + JSON.stringify(this.brands));
      },
      (error) => {
        console.log('Error happened  in get all brands' + JSON.stringify(error));
      },
      () => {
        console.log('%% get all brands is completed successfully %%');
      });
    return this.brands;
  }

  getAllCategories() {
    this.http.get<Category[]>(environment.baseUrl + ApiPaths.GetAllCategories).subscribe(
      (response) => {
        this.categories = response;
        this.categoriesRecipe = this.categories.filter(t => {
          return t.type == Constants.RECIPE;
        });
        this.categoriesIngredient = this.categories.filter(t => {
          return t.type == Constants.INGREDIENT;
        });
     //   console.log('categories - ' + JSON.stringify(this.categories));
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
      //  console.log('AppConfiguration - ' + JSON.stringify(this.appConfiguration));
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
    this.getAllCategories();
    this.getAllIngredients();
    this.getAllRecipes();
    this.getAllSuppliers();
    this.getAllBrands();
    console.log(' --------  App cache refreshed ---------');
  }


  getIngredient(ing: Ingredient) {
    this.http.post<Map<number, Ingredient>>(environment.baseUrl + ApiPaths.GetIngredients, Array.of(ing)).subscribe(
      (response: Map<number, Ingredient>) => {
        this.displayIngredientInfo = response.get(ing.id);
      //  console.log('Ingredient - ' + JSON.stringify(this.displayIngredientInfo));
      },
      (error) => {
        console.log('Error happened in getting Ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%% get Ingredient is completed successfully %%');
      });
  }

  async uploadImage(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    this.http.post(environment.baseUrl + ApiPaths.Upload, formData).subscribe(
      (response) => {
     //   console.log('Upload image response-' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in uploading image' + JSON.stringify(error));
      },
      () => {
        console.log('%% uploading image is completed successfully %%');
      });
  }


   getTitle(t:BaseModel):string{
    let title=null;
    if(t.title!=null)
      title=t.title;
    else if(t.label!=null)
      title=t.label;
    else title=t;

    return title;
  }


   trackByIndex(index: number, obj: any): any {
    return index;
  }


  expandSidebar() {
    this.sidebarExpanded = true;
  }

  collapseSidebar() {
    this.sidebarExpanded = false;
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  isOffcanvasOpen = false;

  showOffcanvas() {
    this.isOffcanvasOpen = true;
   // new bootstrap.Offcanvas('#offcanvas').show();
  }

  hideOffcanvas() {
    this.isOffcanvasOpen = false;
  //  new bootstrap.Offcanvas('#offcanvas').hide();
  }

  protected readonly RouterPaths = RouterPaths;
}
