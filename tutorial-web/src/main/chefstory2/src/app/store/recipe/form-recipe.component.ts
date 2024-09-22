// form.component.ts

import { Component, Input } from '@angular/core';
import {Recipe} from "../model/Recipe";
import {RecipeComponent} from "./recipe.component";
import {AppComponent} from "../../app.component";
import {StoreComponent} from "../store.component";

@Component({
  selector: 'form-recipe-component',
  templateUrl: './form-recipe-component.html',
  styleUrls: ['./recipe.component.css']
})
export class FormRecipeComponent {
  @Input() parent: RecipeComponent;
  @Input() recipe: Recipe;
  @Input() appComponent: StoreComponent;
}
