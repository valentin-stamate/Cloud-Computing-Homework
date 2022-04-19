import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import { Router } from '@angular/router';
import {RecipesPost, RecipeItem} from "../../service/models";
import { Buffer } from "buffer";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  loading = false;
  postId: string = '';
  post: RecipesPost;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.post = {
      name: '',
      description: '',
      imageUrl: '',
      items: [],
      tags: [],
      src: '',
    }
  };

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.post = JSON.parse(params.item);
      })

    console.log(this.post)
  }

  onAddIngredients(){
    this.post.items.push({} as RecipeItem);
  }

  onFormUpdate(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);

    this.loading = true;
    axios.patch(Endpoints.PUT+this.post.id, formData)
      .then(res => {

      }).catch(err => {

      }).finally(() => {
        this.router.navigate(['/home'], {});
      });
  }
}
