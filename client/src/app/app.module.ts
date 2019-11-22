import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFormComponent } from './components/upload-form.component';
import { ListComponent } from './components/list.component';
import { FormService } from './services/form.service';
import { SongService } from './services/song.service';
import { AvailableComponent } from './components/available.component';
import { MenuComponent } from './components/menu.component';
import { PlayerComponent } from './components/player.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadFormComponent,
    ListComponent,
    AvailableComponent,
    MenuComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [FormService, SongService],
  bootstrap: [AppComponent]
})
export class AppModule { }
