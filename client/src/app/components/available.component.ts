import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SongService } from '../services/song.service';
import { Router } from '@angular/router';
import { Song, User } from '../models';

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit {

  @ViewChild('user_id', { static: false }) user: ElementRef;
  user_id: string;
  songs: Song[] = [];
  users: User[] = [];

  constructor(private songSvc: SongService,
    private router: Router) { }

  ngOnInit() {
    this.loadData()
  }

  dismiss() {
    this.router.navigate(['']);
  }

  onUserChanged(value) {
    console.log('User: ', value);
    this.user_id = value;
  }

  checkout(index) {
    console.log(this.songs[index].country_code);
    this.songSvc.subscribeSong(this.user_id || this.users[0].user_id, this.songs[index].country_code)
      .then(result => {
        this.router.navigate(['song', this.songs[index].country_code]);
      })
      .catch(err => {
        console.error('Error: ', err);
      })
  }

  private getListOfSong() {
    this.songSvc.getListOfSong()
      .then(result => {
        this.songs = result;
      })
      .catch(err => {
        console.error('Error: ', err);
      })
  }

  private loadData() {
    const p1 = this.songSvc.getListOfSong();
    const p2 = this.songSvc.getUsers();

    Promise.all([p1, p2])
      .then(results => {
        this.songs = results[0];
        this.users = results[1];
      })
      .catch(err => {
        console.error('Error: ', err);
      })
  }
}
