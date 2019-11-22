import { Component, OnInit } from '@angular/core';
import { Song, User } from '../models';
import { SongService } from '../services/song.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  songs: Song[] = [];

  constructor(private songSvc: SongService,
    private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  addNewSong() {
    this.router.navigate(['song/form']);
  }

  navToPlayList() {
    this.router.navigate(['songs']);
  }

  private loadData() {
    this.songSvc.getListOfSong()
      .then(result => {
        this.songs = result;
      })
      .catch(err => {
        console.error('Error: ', err);
      })
  }


}
