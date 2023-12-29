/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.35.1025 on 2022-11-19 15:59:24.

export interface BaseEntity extends Serializable, Cloneable {
    id: number;
    status: Status;
}

export interface Brand extends BaseEntity {
    title: string;
}

export interface Category extends BaseEntity {
    title: string;
    type: string;
}

export interface Ingredient extends BaseEntity {
    title: string;
    unit: string;
    photoId: string;
    videoId: string;
    gst: number;
    supplierForIngredients: SupplierForIngredient[];
    brandForIngredients: BrandForIngredient[];
    categoriesForIngredient: CategoryFor[];
}

export interface Recipe extends BaseEntity {
    title: string;
    subCategory: string;
    course: string;
    collection: string;
    source: string;
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

export interface AddBrand {
    brand: Brand;
}

export interface AddCategory {
    category: Category;
}

export interface AddIngredient {
    ingredient: Ingredient;
}

export interface AddRecipe {
    recipe: Recipe;
}

export interface AddSupplier {
    supplier: Supplier;
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
    ingredient: Ingredient;
    supplier: Supplier;
    brand: Brand;
    category: Category;
    qty: number;
    recipe: Recipe;
}

export interface Unit {
    description: string;
}

export type Status = "ACTIVE" | "INACTIVE";
