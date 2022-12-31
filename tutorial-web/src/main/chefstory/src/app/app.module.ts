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

@NgModule({
  declarations: [
    AppComponent,
    IngredientComponent,
    RecipeComponent,
    BrandComponent,
    SupplierComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    AppRoutingModule,
    NgxEditorModule
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
