import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';
import {CategoryFor} from './CategoryFor';

export class Ingredient {
  id: number;
  title: string;
  skuCost: number = 0;
  skuQty: number = 0;
  unitDetailed: UnitDetailed;
  unit: String;
  photoId: string;
  videoId: string;
  status: string;
  quantityUnit: number;
  perUnitCost: number = this.skuCost / this.skuQty;
  supplierForIngredients: SupplierForIngredient[];
  brandForIngredients: BrandForIngredient[];
  categoriesForIngredient: CategoryFor[];

}
