import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    IngredientComponent,
    RecipeComponent,
    BrandComponent,
    SupplierComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
