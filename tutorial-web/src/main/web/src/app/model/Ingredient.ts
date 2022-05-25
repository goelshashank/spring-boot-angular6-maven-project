import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';
import {CategoryFor} from './CategoryFor';

export class Ingredient {
  id: number;
  title: string;
  unitDetailed: UnitDetailed;
  unit: String;
  photoId: string;
  videoId: string;
  status: string;
  quantityUnit: number;
  supplierForIngredients: SupplierForIngredient[];
  brandForIngredients: BrandForIngredient[];
  categoriesForIngredient: CategoryFor[];

}
