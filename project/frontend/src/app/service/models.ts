export interface Code {
  id: number;
  code: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  money: number;
  address: string;
  foodItems?: FoodItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  email: string;
  foodItems?: FoodItem[];
}

export interface FoodItem {
  id: number ;
  name: string;
  price: number;
  details: string;
  photoUrl: string;
  restaurant: Restaurant;
  priceHistory?: Price[];
}

export interface Price {
  id: number;
  value: number;
  modifyDate: Date;
  foodItem: FoodItem;
}
