import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet} from '@angular/router';
import {CommonModule, isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'chefstory';


  constructor(private router:Router,@Inject(PLATFORM_ID) private platformId: Object){
    this.router.navigate(['/chefstory']);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running on client-side');
    } else {
      console.log('Running on server-side');
    }
  }


}
