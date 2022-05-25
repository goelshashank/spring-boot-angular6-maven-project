import {Brand} from './Brand';

export class BrandForIngredient {
  brand: Brand;
  skuCost: number = 0;
  skuQty: number = 0;
  perUnitCost: number = this.skuCost / this.skuQty;
}
