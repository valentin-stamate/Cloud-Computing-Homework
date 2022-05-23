import { Component, OnInit } from '@angular/core';
import {UrlService} from "../../service/url.service";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {FoodItem, Restaurant} from "../../service/models";
import {Router} from "@angular/router";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  id: number = 0;
  restaurantData: Restaurant = {} as Restaurant;
  restaurantFood: FoodItem[] = [];

  constructor(private router: Router) {
    const id = UrlService.getParameterByName('id');

    if (!id) {
      return;
    }

    this.id = parseInt(id);
  }

  ngOnInit(): void {
    this.fetchRestaurant(this.id);
  }

  fetchRestaurant(id: number) {
    axios.get(`${Endpoints.RESTAURANT}/${id}`)
      .then(res => {
        this.restaurantData = res.data;
        this.restaurantFood = res.data.foodItems;
      }).catch(err => {
      console.log(err);
    });
  }

  goTo(item : FoodItem ){
    this.router.navigate(['/dish'], {
      queryParams: {item:JSON.stringify(item.id)}
    })
  }

}
