import {Component, Injectable, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {environment} from '../../environments/environment';
import {ApiPaths} from '../config/ApiPaths';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {AddIngredient} from '../model/AddIngredient';
import {Brand} from '../model/Brand';
import {Supplier} from '../model/Supplier';
import {AddSupplier} from '../model/AddSupplier';
import {AddBrand} from '../model/AddBrand';
import {Category} from "../model/Category";
import {AddCategory} from "../model/AddCategory";
import {Constants} from "../config/Constants";

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

  constructor(private http: HttpClient, public appComponent: AppComponent) {
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

  onFileUpload(event){

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      this.file=event.target.files[0]
      reader.readAsDataURL(this.file);

    }
  }


  setSuppliers(suppliers: Supplier[]) {
    suppliers.forEach(t => {
      let addSupplier: AddSupplier=new AddSupplier();
      addSupplier.supplier=t;
      addSupplier.supplier.title=t.label;
      this.addIngredient.addSuppliers.push(addSupplier);
    });

    console.log('Supplier  list' + JSON.stringify(Array.from(this.addIngredient.addSuppliers)));

  }

  setCategories(categories: Category[]) {
    categories.forEach(t => {
      let addCategory: AddCategory=new AddCategory();
      addCategory.category=t;
      addCategory.category.title=t.label;
      addCategory.category.type=Constants.INGREDIENT;
      this.addIngredient.addCategories.push(addCategory);
    });

    console.log(' ingredient Categories  list' + JSON.stringify(Array.from(this.addIngredient.addCategories)));

  }


  setBrands(brands: Brand[]) {
    brands.forEach(t => {
      let addBrand: AddBrand=new AddBrand();
      addBrand.brand=t;
      addBrand.brand.title=t.label;
      this.addIngredient.addBrands.push(addBrand);
    });

    console.log('Brands list' + JSON.stringify(Array.from(this.addIngredient.addBrands)));

  }

  calculatePerUnitCost(){
    this.addIngredient.ingredient.perUnitCost=this.addIngredient.ingredient.skuCost/this.addIngredient.ingredient.skuQty;
  }
}
