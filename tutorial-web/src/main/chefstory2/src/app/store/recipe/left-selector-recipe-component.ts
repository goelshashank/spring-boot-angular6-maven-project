// form.component.ts

import { Component, Input } from '@angular/core';
import {Recipe} from "../model/Recipe";
import {RecipeComponent} from "./recipe.component";
import {AppComponent} from "../../app.component";
import {StoreComponent} from "../store.component";
import {Flow} from "../utils/Flow";

@Component({
  selector: 'left-selector-recipe-component',
  templateUrl: './left-selector-recipe-component.html',
  styleUrls: ['./recipe.component.css']
})
export class LeftSelectorRecipeComponent {
  @Input() parent: RecipeComponent;
  @Input() recipe: Recipe;
  @Input() appComponent: StoreComponent;
  protected readonly Flow = Flow;
}
