import {Component, inject} from '@angular/core';
import {Search} from '../search/search';
import {CategoryMenu} from './category-menu/category-menu';
import {LoginCta} from './login-cta/login-cta';
import {AuthenticationService} from '../shared/authentication.service';

@Component({
  selector: 'bs-home',
  imports: [
    Search,
    CategoryMenu,
    LoginCta
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public authService = inject(AuthenticationService);
}
