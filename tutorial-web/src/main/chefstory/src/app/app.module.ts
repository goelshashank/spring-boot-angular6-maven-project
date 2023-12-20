import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {IngredientComponent} from './ingredient/ingredient.component';
import {RecipeComponent} from './recipe/recipe.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {BrandComponent} from './brand/brand.component';
import {SupplierComponent} from './supplier/supplier.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { NgxEditorModule } from "ngx-editor";
import { HomeComponent } from './home/home.component';
import {AuthModule} from "./auth/auth.module";
import { InventoryComponent } from './inventory/inventory.component';
import { KitchenPlannerComponent } from './kitchen-planner/kitchen-planner.component';
import { PrepListComponent } from './prep-list/prep-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PackagingComponent } from './packaging/packaging.component';
import { CategoriesComponent } from './categories/categories.component';
import { StockAtHandComponent } from './stock-at-hand/stock-at-hand.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
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
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    AppRoutingModule,
    NgxEditorModule,
    AuthModule
  ],

  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class AppModule {
}
