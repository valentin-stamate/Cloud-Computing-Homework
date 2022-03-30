import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios";
import {Endpoints} from "../../service/endpoints";
import { Router } from '@angular/router';
import {CatPost} from "../../service/models";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  loading = false;
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
  onFormUpdate(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);

    this.loading = true;
    axios.put(Endpoints.PUT+this.postId, formData)
      .then(res => {

      }).catch(err => {

      }).finally(() => {
        this.router.navigate(['/home'], {});
      });
  }
}
