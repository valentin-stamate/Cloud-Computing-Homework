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
  post = {} as RecipesPost;
  constructor(private route: ActivatedRoute, private router: Router) { };

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.post= JSON.parse(params.item);
      })
    this.post.imageBuffer = new Buffer(this.post.imageBuffer);
    console.log(this.post)
  }

  onAddIngredients(){
    this.post.items.push({} as RecipeItem);
  }
  
 toBase64(arr: Buffer) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
      arr.reduce((data:any, byte:any) => data + String.fromCharCode(byte), '')
    );
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
