import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterService} from "../service/router.service";
import {StoreComponent} from "../store.component";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RouterService]
})
export class HomeComponent implements OnInit , OnDestroy{

  constructor(public appComponent: StoreComponent, public routerService:RouterService, private route: ActivatedRoute, private router:Router) {
  }

  ngOnInit(): void {
    this.appComponent.currentRoute ='/'+this.route.snapshot.routeConfig.path;
   // alert(this.appComponent.currentRoute);

    this.refresh(true,false,true);
    console.log("++++ Initialized Home +++");
  }

  refresh(showRecipe:boolean,toUpdate:boolean,refreshCache:boolean): void {
    if(refreshCache) this.appComponent.refreshAppCache();
  }

  ngOnDestroy(): void {
    this.appComponent.currentRoute='Nil';
    console.log("++++ Destroyed Home +++");
  }

  reload(){
    window.location.reload()
  }

}
