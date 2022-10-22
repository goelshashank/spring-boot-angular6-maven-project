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
import { ActivatedRoute, Router } from '@angular/router';
import { AddIngredient } from '../model/AddIngredient';
import { SupplierForIngredient } from '../model/SupplierForIngredient';
import { CategoryFor } from '../model/CategoryFor';
import { BrandForIngredient } from '../model/BrandForIngredient';
import { Ingredient } from '../model/Ingredient';
import {BaseModel} from "../model/BaseModel";

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
@Injectable()
export class IngredientComponent implements OnInit , OnDestroy{

  name = 'ingredient';
  addIngredient: AddIngredient = new AddIngredient();
  isShowAddIng = true;
  imageSrc: string = null;
  file: File = null;
  displayIngInfo: Ingredient = new Ingredient();
  showIng = true;
  toUpdate: boolean = false;

  constructor(private http: HttpClient, public appComponent: AppComponent, private router: Router, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
   // this.addIngForm.reset();
    }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
    this.appComponent.showIngredientTab();
    this.displayIngInfo=new Ingredient();
    this.toUpdate=false;
  }

  @ViewChild ('addIngForm') addIngForm: NgForm;

  toggleAddIng() {
    this.isShowAddIng = !this.isShowAddIng;
  }

  addIngredients(form: NgForm) {
    let addIngredients: AddIngredient[] = [];
    addIngredients.push(this.addIngredient);

    if (form.valid) {
      console.log('Add ingredient list: ' + JSON.stringify(addIngredients));
    }

    let api:string=null;

      if(!this.toUpdate)
        api=ApiPaths.AddIngredients;
      else
        api=ApiPaths.UpdateIngredients;

    this.http.post(environment.baseUrl + api, addIngredients).subscribe(
      (response) => {
        console.log('Add ingredients response -' + JSON.stringify(response));
        alert('Add ingredients response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in add ingredient' + JSON.stringify(error));
        alert('Error happened in add ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%% add ingredient is completed successfully %%');
        alert('%% add ingredient is completed successfully %%');
      });


    this.appComponent.uploadImage(this.file);

    //-------------------------
    form.reset();
    //this.reloadCurrentRoute();
    this.refresh();
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

 async calculatePerUnitCost(brandForIngredient: BrandForIngredient) {
    brandForIngredient.perUnitCost = brandForIngredient.skuCost / brandForIngredient.skuQty;
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  reloadCurrentRoute() {
    let currentUrl = "ingredient-editor";
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  refresh(): void {
    window.location.reload();
    this.appComponent.showIngredientTab();
  }


  getIngredient(ingredient: Ingredient) {
    this.toggleIngredientDiag(true);
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

  }



  toggleIngredientDiag(showIng: boolean) {
    this.addIngForm.reset();
    this.ngOnInit();
    console.log("show ing value - "+showIng);
    this.showIng = showIng;
  }

  onUpdate(){

      this.showIng=!this.showIng;
      this.toUpdate=true;

      this.addIngredient=new AddIngredient();
      this.addIngredient.ingredient=this.displayIngInfo;

      this.addIngredient.ingredient.catList=this.displayIngInfo.categoriesForIngredient.map((t)=> t.category.title);
      this.addIngredient.ingredient.supplierList=this.displayIngInfo.supplierForIngredients.map((t)=> t.supplier.title);
      this.addIngredient.ingredient.brandList=this.displayIngInfo.brandForIngredients.map((t)=> t.brand.title)
  }


}
