import {Brand} from './Brand';

export class BrandForIngredient {
  brand: Brand;
  skuCost: number = 0;  //mrp excluding GST
  skuQty: number = 0;
  perUnitCost: number = this.skuCost / this.skuQty;  //per unit cost excluding gst

}
