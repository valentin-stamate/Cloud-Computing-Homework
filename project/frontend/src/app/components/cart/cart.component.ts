import { Component, OnInit } from '@angular/core';
import {FoodItem, Restaurant, User} from "../../service/models";
import axios, {AxiosRequestConfig} from "axios";
import {Endpoints} from "../../service/endpoints";
import {Cookies, CookieService} from "../../service/cookie.service";
import {JwtService} from "../../service/jwt.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  foodItems: FoodItem[] = [];
  totalPrice: number = 0;
  config: AxiosRequestConfig;

  fetchedUser: User = {} as User;

  constructor() {
    const token = CookieService.readCookie(Cookies.AUTH);

    this.config = {
      headers: {
        'Authorization': token
      }
    };
  }

  ngOnInit(): void {
    this.onRefreshCart();
    this.refreshUserProfile();
  }

  onRefreshCart() {

    axios.get(Endpoints.USER_CART, this.config)
      .then(res => {
        this.foodItems = res.data;
        this.totalPrice = this.foodItems.reduce((prev, curr) => prev + curr.price, 0);
      }).catch(err => {

      });

  }

  onPlaceOrder() {

    axios.post(Endpoints.ORDER, {}, this.config)
      .then(res => {
        location.href = '/cart'
      }).catch(err => {

      });
  }

  refreshUserProfile() {
    axios.get(Endpoints.USER_PROFILE, this.config)
      .then(res => {
        this.fetchedUser = res.data;
      }).catch(err => {
      console.log(err);
    });
  }

  onRemoveItem(item: FoodItem) {

    axios.delete(`${Endpoints.USER_CART}/${item.id}`, this.config)
      .then(res => {
        location.href = '/cart';
      }).catch(err => {

      });

  }

}
