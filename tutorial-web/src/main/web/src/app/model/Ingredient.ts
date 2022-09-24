import {UnitDetailed} from './UnitDetailed';
import {SupplierForIngredient} from './SupplierForIngredient';
import {BrandForIngredient} from './BrandForIngredient';
import {CategoryFor} from './CategoryFor';
import {Category} from "./Category";
import {Brand} from "./Brand";
import {Supplier} from "./Supplier";
import {jsonIgnore} from "json-ignore";

export class Ingredient {
  id: number;
  title: string;
  unitDetailed: UnitDetailed;
  unit: String;
  photoId: string;
  videoId: string;
  status: string;
  quantityUnit: number;
  supplierForIngredients: SupplierForIngredient[]=[];
  brandForIngredients: BrandForIngredient[]=[];
  categoriesForIngredient: CategoryFor[]=[];

  @jsonIgnore() catList:Category[]=[];
  @jsonIgnore() brandList: Brand[]=[];
  @jsonIgnore() supplierList: Supplier[]=[];






}
