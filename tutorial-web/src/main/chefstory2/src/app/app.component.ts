import { Component } from '@angular/core';
import {RouterLink, RouterLinkWithHref, RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref,CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chefstory2';
}
