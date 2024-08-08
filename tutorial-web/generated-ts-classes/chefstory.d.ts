/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.35.1025 on 2024-08-08 22:30:14.

export interface BaseEntity extends Serializable, Cloneable {
    modifiedTs: Date;
    id: number;
    status: Status;
}

export interface Brand extends BaseEntity {
    title: string;
}

export interface Category extends BaseEntity {
    title: string;
    type: string;
    isSub: boolean;
}

export interface Ingredient extends BaseEntity {
    title: string;
    unit: string;
    photoId: string;
    videoId: string;
    gst: number;
    minimumInventory: number;
    supplierForIngredients: SupplierForIngredient[];
    brandForIngredients: BrandForIngredient[];
    categoriesForIngredient: CategoryFor[];
}

export interface Recipe extends BaseEntity {
    title: string;
    course: string;
    collection: string;
    source: string;
    sourceURL: string;
    method: string;
    notes: string;
    servingQty: number;
    cookTime: string;
    prepTime: string;
    rating: number;
    unit: string;
    ingredientInRecipe: IngredientInRecipe[];
    categoriesForRecipe: CategoryFor[];
    instructions: string;
    shelfLife: string;
    remarks: string;
    photoId: string;
    videoId: string;
}

export interface Supplier extends BaseEntity {
    title: string;
}

export interface GetConfigResponse {
    units: Unit[];
    unitsDetailed: { [index: string]: UnitWrap[] };
}

export interface UnitWrap {
    unit: Unit;
    description: string;
}

export interface Serializable {
}

export interface Cloneable {
}

export interface SupplierForIngredient extends BaseEntity {
    supplier: Supplier;
    ingredient: Ingredient;
}

export interface BrandForIngredient extends BaseEntity {
    brand: Brand;
    skuCost: number;
    skuQty: number;
    perUnitCost: number;
    ingredient: Ingredient;
}

export interface CategoryFor extends BaseEntity {
    category: Category;
    ingredient: Ingredient;
    recipe: Recipe;
}

export interface IngredientInRecipe extends BaseEntity {
    subRecipe: Recipe;
    ingredient: Ingredient;
    supplier: SupplierForIngredient;
    brand: BrandForIngredient;
    category: Category;
    qty: number;
    recipe: Recipe;
    ingRecipe: Recipe;
}

export interface Unit {
    description: string;
}

export type Status = "ACTIVE" | "INACTIVE";
