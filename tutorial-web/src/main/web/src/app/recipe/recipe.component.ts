import {Component, Injectable, OnInit} from '@angular/core';
import {ApiPaths} from '../config/ApiPaths';
import {environment} from '../../environments/environment';
import {AddRecipe} from '../model/AddRecipe';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/Recipe';
import {Ingredient} from '../model/Ingredient';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
@Injectable()
export class RecipeComponent implements OnInit {

  addRecipe: AddRecipe=new AddRecipe();
  title = 'recipe';
  recipe :Recipe=new Recipe();
  addRecipeCompIdList:number []=[];
  addIngCompIdList:number []=[];
 // ing :Ingredient=new Ingredient();
  constructor(private http: HttpClient, public appComponent:AppComponent) {
  }

  ngOnInit(): void {
   this.appComponent.refreshAppCache();
  }


  addRecipes(form: NgForm) {

    this.addRecipe.recipeCompIds=this.addRecipeCompIdList;
    this.addRecipe.ingredientCompIds=this.addIngCompIdList;
    this.addRecipe.recipe=this.recipe;

    let addRecipeList: AddRecipe[] = [];
    addRecipeList.push(this.addRecipe);

    if (form.valid)
      console.log("Add recipe list: "+ JSON.stringify(addRecipeList));

    this.http.post(environment.baseUrl + ApiPaths.AddRecipes, addRecipeList).subscribe(
      (response) => {
        console.log('Add recipes response -'+ JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log(' %% add recipe call is completed successfully %%'); });

     form.reset();
     this.ngOnInit();
  }

  selectAll() {
    this.addIngCompIdList = this.appComponent.ingredientList.map(x => x.id);
  }

  unselectAll() {
    this.addIngCompIdList = [];
  }

  toggleCheckAll(values: any) {
    if(values.currentTarget.checked){
      this.selectAll();
    } else {
      this.unselectAll();
    }
  }

}
