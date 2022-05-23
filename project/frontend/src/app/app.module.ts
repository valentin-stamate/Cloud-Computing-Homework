import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { DishComponent } from './components/dish/dish.component';
import { OwnerComponent } from './components/owner/owner.component';
import { BasketComponent } from './components/basket/basket.component';
import { UserComponent } from './components/user/user.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RestaurantComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DishComponent,
    OwnerComponent,
    BasketComponent,
    UserComponent,
    RestaurantProfileComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
