import {AfterViewInit, Component, Injectable, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormGroup, NgForm, NgModel} from '@angular/forms';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../config/ApiPaths';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';

import { Brand } from '../model/Brand';
import { Supplier } from '../model/Supplier';

import { Category } from '../model/Category';

import { Constants } from '../config/Constants';
import { AddIngredient } from '../model/AddIngredient';
import { SupplierForIngredient } from '../model/SupplierForIngredient';
import { CategoryFor } from '../model/CategoryFor';
import { BrandForIngredient } from '../model/BrandForIngredient';
import { Ingredient } from '../model/Ingredient';
import {RouterService} from "../service/router.service";
import {ActivatedRoute} from "@angular/router";
import {RouterPaths} from "../config/RouterPaths";

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css'],
  providers: [RouterService]
})
@Injectable()
export class IngredientComponent implements OnInit , OnDestroy {

  name = 'ingredient';
  addIngredient: AddIngredient = new AddIngredient();
  imageSrc: string = null;
  file: File = null;
  displayIngInfo: Ingredient = new Ingredient();
  showIng = true;
  toUpdate: boolean = false;
  @ViewChild ('addIngForm') addIngForm: NgForm;

  constructor(private http: HttpClient, public appComponent: AppComponent, public routerService:RouterService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.appComponent.currentRoute='Nil';
    console.log("++++ Destroyed Ingredient +++");
    }

  ngOnInit(): void {
    this.refresh(true,false,true);
    console.log("++++ Initialized Ingredients +++");
  }

  refresh(showIng:boolean,toUpdate:boolean,refreshCache:boolean): void {
    this.appComponent.refreshAppCache();
    if(this.addIngForm!=null) this.addIngForm.reset();
    this.displayIngInfo=new Ingredient();
    this.showIng = showIng;
    this.toUpdate= toUpdate;
  }

  addIngredients() {
    let addIngredients: AddIngredient[] = [];
    addIngredients.push(this.addIngredient);

    if (this.addIngForm.valid) {
     // console.log('Add ingredient list: ' + JSON.stringify(addIngredients));
    }

    let api:string=null;

      if(!this.toUpdate)
        api=ApiPaths.AddIngredients;
      else
        api=ApiPaths.UpdateIngredients;

    this.http.post(environment.baseUrl + api, addIngredients).subscribe(
      (response) => {
        console.log('Add ingredients response -' + JSON.stringify(response));
       // alert('Add ingredients response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in add ingredient' + JSON.stringify(error));
        alert('Error happened in add ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%% add ingredient is completed successfully %%');
      //  alert('%% add ingredient is completed successfully %%');
      });
    this.appComponent.uploadImage(this.file);

    this.reload();
  }


  onFileUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      this.file = event.target.files[0];
      reader.readAsDataURL(this.file);

    }
  }


  setSuppliers(t: Supplier) {

    let title=this.appComponent.getTitle(t);

  if (!this.addIngredient.ingredient.supplierForIngredients.map((o) => o.supplier.title).includes(title)) {
    let u: SupplierForIngredient = new SupplierForIngredient();
    u.supplier = new Supplier();
    u.supplier.title = title;
    this.addIngredient.ingredient.supplierForIngredients.push(u);
  }
    console.log('Added, Supplier  list - ' + JSON.stringify(Array.from(this.addIngredient.ingredient.supplierForIngredients)));
  }

  removeSuppliers(t: Supplier) {
    let title=this.appComponent.getTitle(t);

    this.addIngredient.ingredient.supplierForIngredients = this.addIngredient.ingredient.supplierForIngredients.filter(({ supplier }) => supplier.title != title);

    console.log('After Removal, Supplier  list - ' + JSON.stringify(Array.from(this.addIngredient.ingredient.supplierForIngredients)));

  }

  setCategories(t: Category) {
    let title=this.appComponent.getTitle(t);

  if (!this.addIngredient.ingredient.categoriesForIngredient.map((o) => o.category.title).includes(title)) {
    let u: CategoryFor = new CategoryFor();
    u.category = new Category();
    u.category.title = title;
    u.category.type = Constants.INGREDIENT;
    this.addIngredient.ingredient.categoriesForIngredient.push(u);
  }

    console.log('Added: ingredient Categories  list' + JSON.stringify(Array.from(this.addIngredient.ingredient.categoriesForIngredient)));
  }

  removeCategories(t: Category) {
    let title=this.appComponent.getTitle(t);

    this.addIngredient.ingredient.categoriesForIngredient = this.addIngredient.ingredient.categoriesForIngredient.filter(({ category }) => category.title != title);

    console.log('Removed: ingredient Categories  list' + JSON.stringify(Array.from(this.addIngredient.ingredient.categoriesForIngredient)));
  }


  setBrands(t: Brand) {

    let title=this.appComponent.getTitle(t);

    if (!this.addIngredient.ingredient.brandForIngredients.map((o) => o.brand.title).includes(title)) {
      let u: BrandForIngredient = new BrandForIngredient();
      u.brand = new Brand();
      u.brand.title = title;
      this.addIngredient.ingredient.brandForIngredients.push(u);
    }
    console.log('Added: Brands list - ' + JSON.stringify(Array.from(this.addIngredient.ingredient.brandForIngredients)));
  }


  removeBrands(t: Brand) {

    let title=this.appComponent.getTitle(t);

    this.addIngredient.ingredient.brandForIngredients = this.addIngredient.ingredient.brandForIngredients.filter(({ brand }) => brand.title != title);

    console.log('Removed:  Brands list - ' + JSON.stringify(Array.from(this.addIngredient.ingredient.brandForIngredients)));
  }

  calculatePerUnitCost(brandForIngredient: BrandForIngredient) {
    brandForIngredient.perUnitCost = brandForIngredient.skuCost / brandForIngredient.skuQty;
  }

  getIngredient(ingredient: Ingredient) {
    this.http.post<Ingredient[]>(environment.baseUrl + ApiPaths.GetIngredients, Array.of(ingredient)).subscribe(
      (response) => {
        this.displayIngInfo = response[0];
      //  console.log('Ingredient - ' + JSON.stringify(this.displayIngInfo));
      },
      (error) => {
        console.log('Error happened in getting ing' + JSON.stringify(error));
      },
      () => {
        console.log('%% get ing is completed successfully %%');
      });
    this.refresh(true,false,false);
  }

  onUpdate(){
  //alert('test');
      this.showIng=false;
      this.toUpdate=true;

      this.addIngredient=new AddIngredient();
      this.addIngredient.ingredient=this.displayIngInfo;

      this.addIngredient.ingredient.catList=this.displayIngInfo.categoriesForIngredient.map((t)=> t.category.title);
      this.addIngredient.ingredient.supplierList=this.displayIngInfo.supplierForIngredients.map((t)=> t.supplier.title);
      this.addIngredient.ingredient.brandList=this.displayIngInfo.brandForIngredients.map((t)=> t.brand.title)
  }


  reload(){
    window.location.reload()
  }


  protected readonly RouterPaths = RouterPaths;
}
