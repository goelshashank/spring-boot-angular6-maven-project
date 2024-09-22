/*
// form.component.ts

import { Component, Input } from '@angular/core';
import {Recipe} from "../model/Recipe";
import {RecipeComponent} from "./recipe.component";
import {AppComponent} from "../../app.component";
import {StoreComponent} from "../store.component";

@Component({
  selector: 'display-recipe-component',
  templateUrl: './display-recipe-component.html',
  styleUrls: ['./recipe.component.css']
})
export class DisplayRecipeComponent {
  @Input() parent: RecipeComponent;
  @Input() recipe: Recipe;
  @Input() appComponent: StoreComponent;
}
*/
