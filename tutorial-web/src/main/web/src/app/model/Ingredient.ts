import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';
import {CategoryFor} from './CategoryFor';
import {Category} from "./Category";
import {Brand} from "./Brand";
import {Supplier} from "./Supplier";
import {jsonIgnore} from "json-ignore";
import {BaseModel} from "./BaseModel";

export class Ingredient extends BaseModel{
  unitDetailed: UnitDetailed;
  unit: String;
  photoId: string;
  videoId: string;
  status: string;
  quantityUnit: number=1;
  supplierForIngredients: SupplierForIngredient[]=[];
  brandForIngredients: BrandForIngredient[]=[];
  categoriesForIngredient: CategoryFor[]=[];

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() brandList: String[]=[];
  @jsonIgnore() supplierList: String[]=[];

}
