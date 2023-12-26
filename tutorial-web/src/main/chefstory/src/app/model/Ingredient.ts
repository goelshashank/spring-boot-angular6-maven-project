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
  unit: string;
  photoId: string;
  videoId: string;
  status: string;
  gst:number;
  minimumInventory:number;

  supplierForIngredients: SupplierForIngredient[]=[];
  brandForIngredients: BrandForIngredient[]=[];
  categoriesForIngredient: CategoryFor[]=[];

  @jsonIgnore() catList:String[]=[];
  @jsonIgnore() subCatList:String[]=[];
  @jsonIgnore() brandList: String[]=[];
  @jsonIgnore() supplierList: String[]=[];


}
