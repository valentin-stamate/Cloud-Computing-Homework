import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosRequestConfig } from 'axios';
import { Cookies, CookieService } from 'src/app/service/cookie.service';
import { Endpoints } from 'src/app/service/endpoints';
import { JwtService } from 'src/app/service/jwt.service';
import { FoodItem } from 'src/app/service/models';
import { Restaurant } from 'src/app/service/models';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.scss']
})
export class DishComponent implements OnInit {
  config: AxiosRequestConfig = {} as any;
  id = "";
  item : FoodItem;
  setDisabled: boolean;
  dates : string[];
  prices : string[];
  myChart:any;
  constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef) {
   this.item ={ 
        id: 0,
        name: '',
        price: 0,
        details: '',
        photoUrl: '',
        restaurant: {id: 0,
                     profilePhotoUrl:'',
                     name:'',
                     email:'',
                     coverPhotoUrl:''},
        priceHistory: []
    }
    this.dates = [];
    this.prices = [];
    this.setDisabled = (CookieService.allCookies.length != 0);

    const token = CookieService.readCookie(Cookies.AUTH);

    if (!token) {
      return;
    }
    const decodedToken = JwtService.decodeJWT(token);

    this.config = {
      headers: {
        'Authorization': token
      }
    };

    
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.id = JSON.parse(params.item);
      })
      axios.get(`${Endpoints.FOOD}/${this.id}`).then(res => {
          this.item = res.data;
          this.dates = this.getDates(this.item);
          this.prices = this.getPrices(this.item); 
          this.buildChart();
        }).catch(err => {

        });
        
  }
  addToBasket(item : FoodItem){

    var body = new FormData();
    body.append("foodId",JSON.stringify(item.id));
    axios.post(Endpoints.USER_CART, body, this.config)
      .then(res => {

      }).catch(err => {

      }).finally(() => {
        window.location.href = '/home';
      });
  }

  buildChart(){
    let htmlRef = this.elementRef.nativeElement.querySelector(`#myChart`);
        this.myChart = new Chart(htmlRef, {
          type: 'line',
          data: {
              labels: this.dates,
                  datasets: [{
                      label: 'Price evolution',
                      data: this.prices,
                      backgroundColor: "#0196FD",
                      borderColor:"#0196FD",
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
    }

    getDates(item : FoodItem){
        const dates = [];
        if(item.priceHistory?.length){
          for(let index = 0; index < item.priceHistory.length; index++){
            dates.push(item.priceHistory[index].modifyDate.toString());
          }
        }
        return dates;
    }

    getPrices(item : FoodItem){
      const prices = [];
      if(item.priceHistory?.length){
        for(let index = 0; index < item.priceHistory.length; index++){
          prices.push(item.priceHistory[index].value.toString());
        }
      }
      return prices;
  }
}