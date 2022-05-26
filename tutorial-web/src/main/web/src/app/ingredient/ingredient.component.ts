import {Component, Injectable, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {environment} from '../../environments/environment';
import {ApiPaths} from '../config/ApiPaths';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

import {Brand} from '../model/Brand';
import {Supplier} from '../model/Supplier';

import {Category} from '../model/Category';

import {Constants} from '../config/Constants';
import {ActivatedRoute, Router} from '@angular/router';
import { AddIngredient } from '../model/AddIngredient';
import { SupplierForIngredient } from '../model/SupplierForIngredient';
import { CategoryFor } from '../model/CategoryFor';
import { BrandForIngredient } from '../model/BrandForIngredient';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
@Injectable()
export class IngredientComponent implements OnInit {

  title = 'ingredient';
  addIngredient: AddIngredient = new AddIngredient();
  isShowAddIng = true;
  imageSrc: string;
  file: File;

  constructor(private http: HttpClient, public appComponent: AppComponent,private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.appComponent.refreshAppCache();
  }

  toggleAddIng() {
    this.isShowAddIng = !this.isShowAddIng;
  }

  addIngredients(form: NgForm) {
    let addIngredients: AddIngredient[] = [];
    addIngredients.push(this.addIngredient);

    if (form.valid) {
      console.log('Add ingredient list: ' + JSON.stringify(addIngredients));
    }

    this.http.post(environment.baseUrl + ApiPaths.AddIngredients, addIngredients).subscribe(
      (response) => {
        console.log('Add ingredients response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in add ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%% add ingredient is completed successfully %%');
      });


    this.appComponent.uploadImage(this.file);

//-------------------------
    form.reset();
    this.ngOnInit();
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


  setSuppliers(suppliers: Supplier[]) {
    suppliers.forEach(t => {
      let addSupplier: SupplierForIngredient = new SupplierForIngredient();
      addSupplier.supplier = t;
      addSupplier.supplier.title = t.label;
      this.addIngredient.ingredient.supplierForIngredients.push(addSupplier);
    });

    console.log('Supplier  list' + JSON.stringify(Array.from(this.addIngredient.ingredient.supplierForIngredients)));

  }

  setCategories(categories: Category[]) {
    categories.forEach(t => {
      let addCategory: CategoryFor = new CategoryFor();
      addCategory.category = t;
      addCategory.category.title = t.label;
      addCategory.category.type = Constants.INGREDIENT;
      this.addIngredient.ingredient.categoriesForIngredient.push(addCategory);
    });

    console.log(' ingredient Categories  list' + JSON.stringify(Array.from(this.addIngredient.ingredient.categoriesForIngredient)));

  }


  setBrands(brands: Brand[]) {
    brands.forEach(t => {
      let addBrand: BrandForIngredient = new BrandForIngredient();
      addBrand.brand = t;
      addBrand.brand.title = t.label;
      this.addIngredient.ingredient.brandForIngredients.push(addBrand);
    });

    console.log('Brands list' + JSON.stringify(Array.from(this.addIngredient.ingredient.brandForIngredients)));

  }

  calculatePerUnitCost(brandForIngredient : BrandForIngredient) {
    brandForIngredient.perUnitCost = brandForIngredient.skuCost / brandForIngredient.skuQty;
  }
  
}
