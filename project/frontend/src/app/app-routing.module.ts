import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RestaurantComponent} from "./components/restaurant/restaurant.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";
import { DishComponent } from './components/dish/dish.component';
import { OwnerComponent } from './components/owner/owner.component';
import { BasketComponent } from './components/basket/basket.component';

const routes: Routes = [
  {path: 'restaurant', component: RestaurantComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'home', component: HomeComponent},
  {path: 'dish', component: DishComponent},
  {path: 'owner', component: OwnerComponent},
  {path: 'basket', component: BasketComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
