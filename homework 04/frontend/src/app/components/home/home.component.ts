import { Component, OnInit } from '@angular/core';
import {RecipesPost} from "../../service/models";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import { Router } from '@angular/router';
import {UtilService} from "../../service/util.service";
import { Buffer } from "buffer";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})



export class HomeComponent implements OnInit {
  loading = false;

  posts: RecipesPost[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {

    axios.get(Endpoints.POSTS).then(res => {
      this.posts = res.data.map((item: RecipesPost) => {
        return {
          ...item,
          imageBuffer: new Buffer(item.imageBuffer)
        }
      });
      /* Now the image buffer is of type Uint8Array */

    }).catch(err => {

    }).finally(() => {

    });
  }

 toBase64(arr: Buffer) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
       arr.reduce((data:any, byte:any) => data + String.fromCharCode(byte), '')
    );
 }

  goTo(item: RecipesPost){
    this.router.navigate(['/post'], {
      queryParams: {id: item.id}
    })
  }

  getDate(seconds: any){
    return UtilService.getDate(seconds);
  }

  editPost(item: RecipesPost){
    this.router.navigate(['/edit'], {
      queryParams: {id: item.id}
    })
  }

  // getTags(item: RecipesPost) {
  //   axios.get(`${Endpoints.TAGS}/${item.id}`)
  //     .then(res => {
  //       const taggedPost = res.data;
  //       item.tags = taggedPost.tags;
  //     }).catch(err => {

  //     }).finally(() => {

  //     });

  // }

  // translate(item: CatPost) {
  //   axios.get(`${Endpoints.TRANSLATE}/${item.id}?lang=${'ro'}`)
  //     .then(res => {
  //       const translatedPost = res.data as CatPost;

  //       item.name = translatedPost.name;
  //       item.description = translatedPost.description;
  //       item.breed = translatedPost.breed;

  //     }).catch(err => {

  //   }).finally(() => {

  //   });
  // }

}
