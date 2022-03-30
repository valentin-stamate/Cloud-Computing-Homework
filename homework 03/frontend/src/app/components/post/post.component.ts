import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {CatPost} from "../../service/models";
import { Router } from '@angular/router';
import {UtilService} from "../../service/util.service";
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postId: string = '';
  post: CatPost = new CatPost();

  constructor(private route: ActivatedRoute, private router: Router) { };
  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.postId = params.id;
      })

      axios.get(Endpoints.POST+this.postId).then(res => {
        this.post = res.data;
      }).catch(err => {

      }).finally(() => {

      });
  }
  deletePost(){
    axios.delete(Endpoints.DELETE+this.postId).then(res => {}).catch(err => {

    }).finally(() => {
      this.router.navigate(['/home'], {});
    });
  }

  getDate(seconds: any){
    return UtilService.getDate(seconds);
  }

}
