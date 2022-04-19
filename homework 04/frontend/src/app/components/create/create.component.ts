import { Component, OnInit } from '@angular/core';
import {RecipeItem, RecipesPost} from "../../service/models";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  ingredientsCounter = 1;
  arrayOfingredients: RecipeItem[] = [{name: "", quantity: 0}];
  constructor() { }

  ngOnInit(): void {
  }

  onAddIngredients(){
    this.arrayOfingredients.push({name: "", quantity: 0});
  }

  onFormSubmit(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);
    formData.append("items", JSON.stringify(this.arrayOfingredients));

    // const formObject = Object.fromEntries(formData);

    axios.post(Endpoints.POSTS, formData)
      .then(res => {

      }).catch(err => {

      }).finally(() => {
        window.location.href = '/home';
      });
  }

}
