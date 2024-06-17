import {AfterViewInit, Component, Injectable, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormGroup, NgForm, NgModel} from '@angular/forms';
import {environment} from "../../../environments/environment";
import {ApiPaths} from '../config/ApiPaths';
import {HttpClient} from '@angular/common/http';
import {StoreComponent} from '../store.component';

import {Brand} from '../model/Brand';
import {Supplier} from '../model/Supplier';

import {Category} from '../model/Category';

import {Constants} from '../config/Constants';
import {SupplierForIngredient} from '../model/SupplierForIngredient';
import {CategoryFor} from '../model/CategoryFor';
import {BrandForIngredient} from '../model/BrandForIngredient';
import {Ingredient} from '../model/Ingredient';
import {RouterService} from "../service/router.service";
import {ActivatedRoute} from "@angular/router";
import {RouterPaths} from "../config/RouterPaths";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {Recipe} from "../model/Recipe";

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css'],
  providers: [RouterService]
})
@Injectable()
export class IngredientComponent implements OnInit, OnDestroy {

  name = 'ingredient';
  imageSrc: string = null;
  file: File = null;
  ingredient: Ingredient = new Ingredient(null);
  showIng = true;
  toUpdate: boolean = false;
  sortIngredientsBy: string = null;
  @ViewChild('addIngForm') addIngForm: NgForm;

  constructor(private http: HttpClient, public storeComponent: StoreComponent, public routerService: RouterService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.storeComponent.currentRoute = 'Nil';
    this.storeComponent.isIngActive=false; //todo: why is this needed
    console.log("++++ Destroyed Ingredient +++");
  }

  ngOnInit(): void {
    this.refresh(true, false, true);
    this.sortIngredients('category');
    this.storeComponent.isIngActive=true;
    console.log("++++ Initialized Ingredients +++");
  }

  refresh(showIng: boolean, toUpdate: boolean, refreshCache: boolean): void {
    if(refreshCache)  this.storeComponent.refreshAppCache();
    if (!showIng && this.addIngForm != null) {
      this.addIngForm.reset();
      this.addIngForm=null;
      this.ingredient = new Ingredient(null);
    }
    this.toUpdate = toUpdate;
    this.showIng = showIng;
  }

  addIngredients() {
    let ingredients: Ingredient[] = [this.ingredient];
    let title=this.ingredient.title;  //todo: why is this needed

    if (this.addIngForm.valid) {
      // console.log('Add ingredient list: ' + JSON.stringify(addIngredients));
    }

    let api = !this.toUpdate ? ApiPaths.AddIngredients : ApiPaths.UpdateIngredients;
    this.http.post(environment.baseUrl + api, ingredients).subscribe(
      (response) => {
        console.log(api + 'ingredients response -' + JSON.stringify(response));
        // alert('Add ingredients response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in' + api + 'ingredient' + JSON.stringify(error));
       // alert('Error happened in add ingredient' + JSON.stringify(error));
      },
      () => {
        console.log('%%' + api + 'ingredient is completed successfully %%');

        this.reload();
        let ing:Ingredient=new Ingredient(title);
        this.getIngredient(ing);
        //  alert('%% add ingredient is completed successfully %%');
      });
    this.storeComponent.uploadImage(this.file);
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

  getIngredient(ingredient: Ingredient) {
    this.http.post<Ingredient[]>(environment.baseUrl + ApiPaths.GetIngredients, Array.of(ingredient)).subscribe(
      (response) => {
        this.ingredient = response[0];
        Ingredient.updateCosts(this.ingredient);
        //  console.log('Ingredient - ' + JSON.stringify(this.displayIngInfo));
      },
      (error) => {
        console.log('Error happened in getting ing' + JSON.stringify(error));
      },
      () => {
        //alert(this.displayIngInfo.gst);
        this.refresh(true, false, true);
        console.log('%% get ing is completed successfully %%');
      });

  }

  onUpdate() {
    //alert('test');
    console.time('Execution time of update ingredient');
    Ingredient.update(this.ingredient)
    this.toUpdate = true;

    this.storeComponent.sleep(5)
    this.showIng = false;
    console.timeEnd('Execution time of update ingredient');
  }

  sortIngredients(type: string) {
    this.sortIngredientsBy = type;
    if (type == 'category') {
      this.storeComponent.sortIngredientsByCategory(this.storeComponent.ingredients)
    }
  }


  remove() {

    this.http.post(environment.baseUrl + ApiPaths.RemoveIngredients, [this.ingredient]).subscribe(
      (response) => {
        console.log('remove ingredients response -' + JSON.stringify(response));
        // alert('Add ingredients response -' + JSON.stringify(response));
      },
      (error) => {
        console.log('Error happened in remove ingredient' + JSON.stringify(error));
       // alert('Error happened in remove ingredient' + JSON.stringify(error));
      },
      () => {
        this.reload();
        console.log('%% remove ingredient is completed successfully %%');
        //  alert('%% add ingredient is completed successfully %%');
      });

  }

  exportIngs(): void {
    const pojoList: Ingredient[] = this.storeComponent.ingredients;
    const workbook = XLSX.utils.book_new();

    const data: any[][] = [];
    const headerRow = ['S.No.', 'Title', 'Category', 'Supplier', 'Brand [SKU Cost|SKU Qty]','GST%','Minimum Inventory','Unit'];
    let i = 0;
    data[i] = headerRow;
    pojoList.forEach((t) => {
      i++;
      let brandStr='';
      t.brandForIngredients.forEach((u,index)=>{
        const s=t.brandForIngredients[index].brand.title + '['+t.brandForIngredients[index].skuCost+'|'+
          t.brandForIngredients[index].skuQty+']';
        if(index==0){
          brandStr=s;
        }else{
          brandStr=brandStr +','+ s;
        }
      });
      let suppStr='';
      t.supplierForIngredients.forEach((u,index)=>{
        const s=t.supplierForIngredients[index].supplier.title;
        if(index==0){
          suppStr=s;
        }else{
          suppStr=suppStr +','+ s;
        }
      });

      const values = [i, t.title, t.categoriesForIngredient[0].category.title, suppStr,
        brandStr,t.gst,t.minimumInventory,t.unit];
      data[i] = values;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {type: 'buffer', bookType: 'xlsx'});
    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});

    FileSaver.saveAs(blob, 'IngredientsList.xlsx');
  }

  importIngs(): void {

  }

  reload() {
   // window.location.reload();
     this.refresh(true,false,true);
  }

  protected readonly BrandForIngredient = BrandForIngredient;
  protected readonly Ingredient = Ingredient;
}
