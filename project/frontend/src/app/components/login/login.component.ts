import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {Cookies, CookieService} from "../../service/cookie.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginWithCode = false;

  authType = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin(form: HTMLFormElement) {

    const formData = new FormData(form);

    if (!this.loginWithCode) {
      axios.post(Endpoints.USER_LOGIN, formData)
        .then(res => {
          this.loginWithCode = true;
        }).catch(err => {
          console.log(err);
        });

      return;
    }

    axios.post(Endpoints.USER_LOGIN_CODE, formData)
      .then(res => {
        CookieService.setCookie(Cookies.AUTH, res.data);
        window.location.href = '/home';
      }).catch(err => {

    });

  }

  onLoginRestaurant(form: HTMLFormElement) {
    const formData = new FormData(form);

    if (!this.loginWithCode) {
      axios.post(Endpoints.RESTAURANT_LOGIN, formData)
        .then(res => {
          this.loginWithCode = true;
        }).catch(err => {
        console.log(err);
      });

      return;
    }

    axios.post(Endpoints.RESTAURANT_LOGIN_CODE, formData)
      .then(res => {
        CookieService.setCookie(Cookies.AUTH, res.data);
        window.location.href = '/home';
      }).catch(err => {

    });
  }

  changeAuthType(authType: number) {
    this.authType = authType;
  }

}
