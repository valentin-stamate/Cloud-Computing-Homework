import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  authType = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onUserSignup(form: HTMLFormElement) {

    const formData = new FormData(form);

    axios.post(Endpoints.USER_SIGNUP, formData)
      .then(res => {
        location.href = '/login';
      }).catch(err => {
        console.log(err);
      });

  }

  onRestaurantSignup(form: HTMLFormElement) {

    const formData = new FormData(form);

    axios.post(Endpoints.RESTAURANT_SIGNUP, formData)
      .then(res => {
        location.href = '/login';
      }).catch(err => {
      console.log(err);
    });

  }



  changeAuthType(authType: number) {
    this.authType = authType;
  }


}
