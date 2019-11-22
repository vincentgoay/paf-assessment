import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadFormComponent } from './components/upload-form.component';
import { ListComponent } from './components/list.component';
import { AvailableComponent } from './components/available.component';
import { MenuComponent } from './components/menu.component';
import { PlayerComponent } from './components/player.component';


const routes: Routes = [
  // { path: '', component: ListComponent },
  { path: 'songs/list', component: ListComponent },
  { path: 'songs', component: AvailableComponent },
  { path: 'song/form', component: UploadFormComponent },
  { path: 'song/:code', component: PlayerComponent },
  { path: '**', redirectTo: '/songs/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
