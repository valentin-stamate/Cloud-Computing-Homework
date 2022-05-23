import { Component, OnInit } from '@angular/core';
import {Cookies, CookieService} from "../../service/cookie.service";
import axios, {AxiosRequestConfig} from "axios";
import {JwtService} from "../../service/jwt.service";
import {FoodItem, Restaurant, User} from "../../service/models";
import {Endpoints} from "../../service/endpoints";
import {Router} from "@angular/router";

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
  fetchedUser: User = {} as User;

  constructor(private router: Router) {
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
    if (this.userType === 1) {
      this.refreshUserProfile();
    }
  }

  refreshUserProfile() {
    axios.get(Endpoints.USER_PROFILE, this.config)
      .then(res => {
        this.fetchedUser = res.data;
      }).catch(err => {
        console.log(err);
      });
  }

  onSearch(searchInput: HTMLInputElement) {
    const searchValue = searchInput.value;
    this.searchBoxOpen = true;

    const formData = new FormData();
    formData.append('searchText', searchValue);

    axios.post(Endpoints.SEARCH, formData)
      .then(res => {
        this.searchedFood = res.data;
      }).catch(err => {

      });
  }

  onSearchClose() {
    this.searchBoxOpen = false;
  }

  goTo(item : FoodItem ){
    this.router.navigate(['/dish'], {
      queryParams: {item:JSON.stringify(item.id)}
    })
  }

}
