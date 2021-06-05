import {Component, Injectable, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Ingredient} from '../model/Ingredient';
import {environment} from '../../environments/environment';
import {ApiPaths} from '../config/ApiPaths';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
@Injectable()
export class IngredientComponent implements OnInit {

  title = 'ingredient';
  ingredient: Ingredient=new Ingredient();
  isShowAddIng=true;
  constructor(private http: HttpClient, public appComponent:AppComponent) {
   // this.getConfiguration();
  }
  ngOnInit(): void {
  }

  toggleAddIng() {
    this.isShowAddIng = !this.isShowAddIng;
  }

  addIngredients(form: NgForm) {
    let ingredientList: Ingredient[] = [];
    ingredientList.push(this.ingredient);

    if (form.valid)
      console.log("Add ingredient list: "+JSON.stringify(ingredientList));

    this.http.post(environment.baseUrl + ApiPaths.AddIngredients, ingredientList).subscribe(
      (response) => {
        console.log(JSON.stringify(response));
      },
      (error) => { console.log('Error happened' + JSON.stringify(error)); },
      () => { console.log('the subscription is completed'); });

    form.reset();
  }

}
