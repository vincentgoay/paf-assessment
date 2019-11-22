import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private http: HttpClient
  ) { }

  getListOfCountries(): Promise<any> {
    return this.http.get<any>('/api/g/countries').toPromise()
  }
}
