import { Component, OnInit } from '@angular/core';
import {CatPost} from "../../service/models";
import axios from "axios";
import {Endpoints} from "../../service/endpoints";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = false;

  posts: CatPost[] = [{
    name: 'dasdad',
    description: 'lorem ipsum dolor sit amed',
    image: 'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg',
    breed: 'siamese',
    creationDate: new Date(),
  },
    {
      name: 'dasdad',
      description: 'lorem ipsum dolor sit amed',
      image: 'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg',
      breed: 'siamese',
      creationDate: new Date(),
    }];

  constructor() { }

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

}
