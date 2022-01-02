import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';

export class Ingredient {
  id: number;
  title: string;
  category: string;
  skuCost: number=0;
  skuQty: number=0;
  unitDetailed:UnitDetailed;
  unit:String
  photoId: string;
  videoId: string;
  status: string;
  quantityUnit: number;
  perUnitCost:number=this.skuCost/this.skuQty;
  supplierForIngredients:SupplierForIngredient[];
  brandForIngredients:BrandForIngredient[];

}
