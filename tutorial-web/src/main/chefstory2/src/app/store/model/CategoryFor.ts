import {Category} from './Category';
import {BaseModel} from "./BaseModel";

export class CategoryFor extends BaseModel{
  constructor(category: Category) {
    super(null);
    this.category = category;
  }
  category: Category;


  static getSubCategories(categoryList:Category[]):Category[]{
    return  categoryList.filter(t=> (t.isSub!=null && t.isSub));
  }

  static getSubCategoriesFor(categoryForList:CategoryFor[]):CategoryFor[]{
    return  categoryForList.filter(t=> (t.category.isSub!=null && t.category.isSub));
  }

  static getMainCategories(categoryList:Category[]):Category[]{
    return  categoryList.filter(t=> !(t.isSub!=null && t.isSub));
  }

  static getMainCategoriesFor(categoryForList:CategoryFor[]):CategoryFor[]{
    return  categoryForList.filter(t=> !(t.category.isSub!=null && t.category.isSub));
  }

}
