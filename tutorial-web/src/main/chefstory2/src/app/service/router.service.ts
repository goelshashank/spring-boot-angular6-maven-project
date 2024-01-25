import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class RouterService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  redirectTo(url: string): void {
    console.log("++++++ loading route  ==> " +url)
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate([url]);
    });
  }

}
