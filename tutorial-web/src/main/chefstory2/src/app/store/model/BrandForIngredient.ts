import {Brand} from './Brand';
import {BaseModel} from "./BaseModel";
import {Ingredient} from "./Ingredient";

export class BrandForIngredient extends  BaseModel{
  constructor(brand: Brand, skuCost: number, skuQty: number) {
    super(null);
    this.brand = brand;
    this.skuCost = skuCost==null?0:skuCost;
    this.skuQty = skuQty==null?0:skuQty;
    BrandForIngredient.updateCosts(this,null);
  }

  brand: Brand;
  skuCost: number;
  skuQty: number;

   // @ts-ignore
  perUnitCost: number;
  perUnitCostInclGST:number;
  skuCostInclGST:number;

  static updateCosts(brandForIngredient:BrandForIngredient,gst:number){
    brandForIngredient.perUnitCost = +(brandForIngredient.skuCost / brandForIngredient.skuQty).toFixed(2);
    if(gst!=null){
      brandForIngredient.perUnitCostInclGST = +(brandForIngredient.perUnitCost* (1 + (gst) / 100)).toFixed(2);
      brandForIngredient.skuCostInclGST = +(brandForIngredient.skuCost* (1 + (gst) / 100)).toFixed(2);
    }
  }




}
