import { Component, OnInit } from '@angular/core';
import {FoodItem, Restaurant} from "../../service/models";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  foodItems: FoodItem[] = [];
  totalPrice: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.onRefreshCart();
  }

  onRefreshCart() {
    const foodItem = {
      id: 1,
      name: 'Ciorba',
      price: 31,
      details: 'dasdd',
      photoUrl: 'https://retete-culinare-cu-dana-valery.ro/cdn/recipes/ciorba-radauteana-cu-carne-de-curcan.jpg',
      restaurant: {} as Restaurant,
    };

    this.foodItems.push(foodItem);
    this.foodItems.push(foodItem);
    this.foodItems.push(foodItem);

    this.totalPrice = 60;
  }

  onPlaceOrder() {

  }

}
