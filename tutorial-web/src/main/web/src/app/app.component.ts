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
     testing = 'hi';
    constructor(private http: HttpClient) { }

    getCars() {
       this.http.get<Recipe[]>('http://localhost:8080/cool-cars').subscribe(
           (response) => {
             this.testing = 'bye';
            // this.carList = response;
           //  console.log(JSON.stringify(this.carList));
             },
           (error) => { console.log('Error happened' + JSON.stringify(error)); },
           () => { console.log('the subscription is completed'); });
    }
}
