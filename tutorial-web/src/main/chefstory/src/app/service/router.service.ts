import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class RouterService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  redirectTo(url: string): void {
    console.log("++++++ loading route  ==> " +url)
    // When skipLocationChange true, navigates without pushing a new state into history.
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([url]);
    });
  }

}
