import { Component, OnInit } from '@angular/core';
import axios, {AxiosRequestConfig} from "axios";
import {Cookies, CookieService} from "../../service/cookie.service";
import {JwtService} from "../../service/jwt.service";
import {FoodItem, Restaurant} from "../../service/models";
import {Endpoints} from "../../service/endpoints";

@Component({
  selector: 'app-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  config: AxiosRequestConfig = {} as any;
  id: number = 0;
  restaurant: Restaurant = {} as Restaurant;

  constructor() {
    const token = CookieService.readCookie(Cookies.AUTH);
    const restaurantPayload = JwtService.decodeJWT(token) as Restaurant;
    this.id = restaurantPayload.id;

    this.config = {
      headers: {
        'Authorization': token
      }
    };
  }

  ngOnInit(): void {
    this.refreshRestaurant(this.id);
  }

  refreshRestaurant(id: number) {
    axios.get(`${Endpoints.RESTAURANT}/${id}`)
      .then(res => {
        this.restaurant = res.data;
      }).catch(err => {
      console.log(err);
    });
  }

  onDeleteFoodItem(item: FoodItem) {
    axios.delete(`${Endpoints.RESTAURANT_FOOD_ITEM}/${item.id}`, this.config)
      .then(res => {
        this.refreshRestaurant(this.id);
      }).catch(err => {
        console.log(err);
      });
  }

  onAddFood(form: HTMLFormElement) {
    const formData = new FormData(form);

    axios.post(Endpoints.RESTAURANT_FOOD_ITEM, formData, this.config)
      .then(res => {
        this.refreshRestaurant(this.id);
      }).catch(err => {
        console.log(err);
      });

  }

}
