import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {RecipesPost} from "../../service/models";
import { Router } from '@angular/router';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
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
  }

  deletePost(){
    axios.delete(Endpoints.DELETE+this.post.id).then(res => {}).catch(err => {

    }).finally(() => {
      this.router.navigate(['/home'], {});
    });
  }
}
