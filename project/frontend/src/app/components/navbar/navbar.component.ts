import { Component, OnInit } from '@angular/core';
import {Cookies, CookieService} from "../../service/cookie.service";
import {AxiosRequestConfig} from "axios";
import {JwtService} from "../../service/jwt.service";
import {FoodItem, Restaurant} from "../../service/models";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  config: AxiosRequestConfig = {} as any;
  userType: number = 0;
  logged = false;
  searchedFood: FoodItem[] = [];
  searchBoxOpen = false;

  user: any = {};

  constructor() {
    const token = CookieService.readCookie(Cookies.AUTH);

    if (!token) {
      return;
    }

    this.logged = true;
    const decodedToken = JwtService.decodeJWT(token);

    this.user = decodedToken;
    this.userType = decodedToken.userType;

    this.config = {
      headers: {
        'Authorization': token
      }
    };
  }

  ngOnInit(): void {
  }

  onSearch(searchInput: HTMLInputElement) {
    const searchValue = searchInput.value;
    this.searchBoxOpen = true;

    /* Demo */

    const foodItem = {
      id: 1,
      name: 'Ciorba',
      price: 31,
      details: 'dasdd',
      photoUrl: 'https://retete-culinare-cu-dana-valery.ro/cdn/recipes/ciorba-radauteana-cu-carne-de-curcan.jpg',
      restaurant: {} as Restaurant,
    };

    this.searchedFood.push(foodItem);
    this.searchedFood.push(foodItem);
    this.searchedFood.push(foodItem);
  }

  onSearchClose() {
    this.searchBoxOpen = false;
  }

}
