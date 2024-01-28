import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipeComponent} from './recipe/recipe.component';
import {IngredientComponent} from './ingredient/ingredient.component';
import {HomeComponent} from "./home/home.component";
import {BrandComponent} from "./brand/brand.component";
import {CategoriesComponent} from "./categories/categories.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {KitchenPlannerComponent} from "./kitchen-planner/kitchen-planner.component";
import {OrderListComponent} from "./order-list/order-list.component";
import {PackagingComponent} from "./packaging/packaging.component";
import {PrepListComponent} from "./prep-list/prep-list.component";
import {SettingsComponent} from "./settings/settings.component";
import {StockAtHandComponent} from "./stock-at-hand/stock-at-hand.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {RouterPaths} from "./config/RouterPaths";
import {StoreComponent} from "./store.component";


const routes: Routes = [

  {
    path: '',
    component: StoreComponent,
    children: [
      {path: RouterPaths.HOME.substring(1), component: HomeComponent},
      {path: 'ingredient', component: IngredientComponent},
      {path: 'recipe', component: RecipeComponent},
      {path: 'brand', component: BrandComponent},
      {path: 'categories', component: CategoriesComponent},
      {path: 'inventory', component: InventoryComponent},
      {path: 'kitchen-planner', component: KitchenPlannerComponent},
      {path: 'order-list', component: OrderListComponent},
      {path: 'packaging', component: PackagingComponent},
      {path: 'prep-list', component: PrepListComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'stock-at-hand', component: StockAtHandComponent},
      {path: 'supplier', component: SupplierComponent},
      {path: "**", component: HomeComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class StoreRoutingModule {


}
