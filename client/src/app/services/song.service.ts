import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Song, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) { }

  getListOfSong(): Promise<Song[]> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    return this.http.get<Song[]>('/api/songs', { headers }).toPromise();
  }

  getUsers(): Promise<User[]> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
      
    return this.http.get<User[]>('/api/users', { headers }).toPromise();
  }

  subscribeSong(user_id, country_code): Promise<any> {
    const params: HttpParams = new HttpParams()
      .set('user_id', user_id)
      .set('country_code', country_code);

    const headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    return this.http.get<any>(`/api/song/checkout`, { params, headers }).toPromise();
  }
}
