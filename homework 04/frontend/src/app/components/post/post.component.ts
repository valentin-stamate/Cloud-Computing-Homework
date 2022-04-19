import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import {RecipesPost} from "../../service/models";
import { Router } from '@angular/router';
import { Buffer } from "buffer";
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postId: string = '';
  post = {} as RecipesPost;

  constructor(private route: ActivatedRoute, private router: Router) { };

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.post= JSON.parse(params.item);
      })
    this.post.imageBuffer = new Buffer(this.post.imageBuffer);
  }
  
 toBase64(arr: Buffer) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
      arr.reduce((data:any, byte:any) => data + String.fromCharCode(byte), '')
    );
  }

  deletePost(){
    axios.delete(Endpoints.DELETE+this.post.id).then(res => {}).catch(err => {

    }).finally(() => {
      this.router.navigate(['/home'], {});
    });
  }
}
