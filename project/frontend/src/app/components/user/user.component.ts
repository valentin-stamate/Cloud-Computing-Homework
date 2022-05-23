import { Component, OnInit } from '@angular/core';
import {UrlService} from "../../service/url.service";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {User} from "../../service/models";
import {Cookies, CookieService} from "../../service/cookie.service";
import {AxiosRequestConfig} from "axios";
import {JwtService} from "../../service/jwt.service";

const host = 'http://localhost:8081';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  config: AxiosRequestConfig = {} as any;
  userType: number = 0;
  logged = false;

  userData: any = {};

  constructor() { 
    const token = CookieService.readCookie(Cookies.AUTH);

    if (!token) {
      return;
    }

    this.logged = true;
    const decodedToken = JwtService.decodeJWT(token);

    this.userData = decodedToken;
    this.userType = decodedToken.userType;

    this.config = {
      headers: {
        'Authorization': token
      }
    };
  }

  ngOnInit(): void {
  }

  onFormUpdate(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);
    
    axios.patch(Endpoints.USER_PROFILE, formData, this.config)
    .then(res => {
      window.location.href = `${host}/home`;
    }).catch(err => {

  });
   
  }
}
