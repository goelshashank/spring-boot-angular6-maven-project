import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterService} from "../service/router.service";
import {AppComponent} from "../app.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RouterService]
})
export class HomeComponent implements OnInit , OnDestroy{

  constructor(public appComponent: AppComponent, public routerService:RouterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


}
