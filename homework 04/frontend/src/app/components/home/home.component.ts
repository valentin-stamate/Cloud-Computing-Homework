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
      this.posts = res.data;
    }).catch(err => {

    }).finally(() => {

    });
  }

  goTo(item: RecipesPost){
    this.router.navigate(['/post'], {
      queryParams: {item:JSON.stringify(item)}
    })
  }

  getDate(seconds: any){
    return UtilService.getDate(seconds);
  }

  editPost(item: RecipesPost){
    this.router.navigate(['/edit'], {
      queryParams: {item:JSON.stringify(item)}
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
