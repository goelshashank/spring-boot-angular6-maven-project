import {Supplier} from './Supplier';
import { BaseModel } from './BaseModel';

export class SupplierForIngredient extends BaseModel{
  constructor(supplier: Supplier) {
    super(null);
    this.supplier = supplier;
  }
  supplier: Supplier;
}
