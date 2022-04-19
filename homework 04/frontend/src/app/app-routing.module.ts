import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import {PostComponent} from "./components/post/post.component";
import { CreateComponent } from './components/create/create.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'post', component: PostComponent},
  {path: 'edit', component: EditComponent},
  {path: 'create', component: CreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
