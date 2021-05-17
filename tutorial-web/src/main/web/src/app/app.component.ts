import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiPaths } from './config/ApiPaths';
import {Recipe} from './model/Recipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {

     title = 'np-app';
     recipeList: Recipe[] = [];
    constructor(private http: HttpClient) { }

    getRecipes() {
       this.http.get<Recipe[]>(environment.baseUrl+ApiPaths.GetAllRecipes).subscribe(
           (response) => {
             this.recipeList = response;
             console.log(JSON.stringify(this.recipeList));
             },
           (error) => { console.log('Error happened' + JSON.stringify(error)); },
           () => { console.log('the subscription is completed'); });
    }
}
