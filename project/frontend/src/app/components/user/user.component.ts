import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onFormUpdate(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const formData = new FormData(form);
   
  }
}
