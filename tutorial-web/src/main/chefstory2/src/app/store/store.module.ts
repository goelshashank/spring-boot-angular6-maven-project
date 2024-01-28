import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreComponent} from "./store.component";
import {IngredientComponent} from "./ingredient/ingredient.component";
import {RecipeComponent} from "./recipe/recipe.component";
import {BrandComponent} from "./brand/brand.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {HomeComponent} from "./home/home.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {KitchenPlannerComponent} from "./kitchen-planner/kitchen-planner.component";
import {PrepListComponent} from "./prep-list/prep-list.component";
import {OrderListComponent} from "./order-list/order-list.component";
import {PackagingComponent} from "./packaging/packaging.component";
import {CategoriesComponent} from "./categories/categories.component";
import {StockAtHandComponent} from "./stock-at-hand/stock-at-hand.component";
import {SettingsComponent} from "./settings/settings.component";
import {SortByOrderPipe} from "./utils/sort-by-order.pipe";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {StoreRoutingModule} from "./store-routing.module";
import {NgxEditorModule} from "ngx-editor";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppComponent} from "../app.component";
import {AuthModule} from "../auth/auth.module";

@NgModule({
  declarations: [
    StoreComponent,
    IngredientComponent,
    RecipeComponent,
    BrandComponent,
    SupplierComponent,
    HomeComponent,
    InventoryComponent,
    KitchenPlannerComponent,
    PrepListComponent,
    OrderListComponent,
    PackagingComponent,
    CategoriesComponent,
    StockAtHandComponent,
    SettingsComponent,
    SortByOrderPipe
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreRoutingModule,
    NgSelectModule,
    NgxEditorModule/*,
    AuthModule*/
  ],

  providers: [],
  bootstrap: [StoreComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class StoreModule { }
