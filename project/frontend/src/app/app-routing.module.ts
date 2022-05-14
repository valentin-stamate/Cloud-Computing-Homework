import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RestaurantComponent} from "./components/restaurant/restaurant.component";

const routes: Routes = [
  {path: 'restaurant', component: RestaurantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
