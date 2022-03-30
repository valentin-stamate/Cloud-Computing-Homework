import { Component, OnInit } from '@angular/core';
import {CatPost} from "../../service/models";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit {
  loading = false;
  
  posts: CatPost[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    axios.get(Endpoints.POSTS).then(res => {
      console.log(res);
      this.posts = res.data;
    }).catch(err => {

    }).finally(() => {

    });
  } 

  onFormSubmit(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);

    this.loading = true;
    axios.post(Endpoints.POSTS, formData)
      .then(res => {

      }).catch(err => {

      }).finally(() => {
        this.fetchPosts();
        this.loading = false;
      });
  }
  goTo(itemId: string){
    return "location.href='post.html/{{itemId}}'";
  }
}