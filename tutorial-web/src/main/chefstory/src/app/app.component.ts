import {Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {RouterPaths} from "./config/RouterPaths";
import {CategoryFor} from "./model/CategoryFor";
import {SortByOrderPipe} from "./utils/sort-by-order.pipe";
/*import '../assets/js/charts/dashboard.js';
import '../assets/js/core/external.min.js';
import '../assets/js/core/libs.min.js';
import '../assets/js/charts/dashboard.js';
import '../assets/js/app.js';
import '../assets/js/countdown.js';
import '../assets/js/fslightbox.js';
import '../assets/js/prism.mini.js';
import '../assets/js/slider-tabs.js';*/

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
  categoryIngredientMap: Map<String,Ingredient[]>=new Map();
  categoryRecipeMap: Map<String,Recipe[]>=new Map();
  isIngActive=false;
  isRecipeActive=false;
  @ViewChild('ingNavLink') ingNavLink: ElementRef;

  constructor(private http: HttpClient,public routerService:RouterService, public route: ActivatedRoute,
              private router:Router,private elementRef: ElementRef,private renderer: Renderer2) {

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

   sortIngredientsByCategory(ingredients: Ingredient []){

    this.categoryIngredientMap=new Map();
    ingredients.forEach(t => {
      this.getMainCategoriesFor(t.categoriesForIngredient).forEach(u =>{
        if(!this.categoryIngredientMap.has(u.category.title)){
          this.categoryIngredientMap.set(u.category.title,[])
        }
        this.categoryIngredientMap.get(u.category.title).push(t)
      })
    });

    const sortByOrderPipe: SortByOrderPipe = new SortByOrderPipe();
    this.categoryIngredientMap.forEach((value, key) => {
     value= sortByOrderPipe.transform(value,'title');
    });

  //  console.log('test')
  }


  sortRecipesByCategory(recipes: Recipe []){

    this.categoryRecipeMap=new Map();
    recipes.forEach(t => {
      this.getMainCategoriesFor(t.categoriesForRecipe).forEach(u =>{
        if(!this.categoryRecipeMap.has(u.category.title)){
          this.categoryRecipeMap.set(u.category.title,[])
        }
        this.categoryRecipeMap.get(u.category.title).push(t)
      })
    });

    const sortByOrderPipe: SortByOrderPipe = new SortByOrderPipe();
    this.categoryRecipeMap.forEach((value, key) => {
      value= sortByOrderPipe.transform(value,'title');
    });

    //  console.log('test')
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

 async refreshAppCache() {
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
      title=t.title.trim();
    else if(t.label!=null)
      title=t.label.trim();
    else title=t;

    return title.trim();
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


  getSubCategories(categoryList:Category[]):Category[]{
    return  categoryList.filter(t=> (t.isSub!=null && t.isSub));
  }

  getSubCategoriesFor(categoryForList:CategoryFor[]):CategoryFor[]{
    return  categoryForList.filter(t=> (t.category.isSub!=null && t.category.isSub));
  }

  getMainCategories(categoryList:Category[]):Category[]{
    return  categoryList.filter(t=> !(t.isSub!=null && t.isSub));
  }

  getMainCategoriesFor(categoryForList:CategoryFor[]):CategoryFor[]{
    return  categoryForList.filter(t=> !(t.category.isSub!=null && t.category.isSub));
  }


  handleClick(){

  }



}
