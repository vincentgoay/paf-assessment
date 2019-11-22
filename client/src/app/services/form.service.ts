import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private http: HttpClient
  ) { }

  getListOfCountries(): Promise<Country[]> {
    return this.http.get<Country[]>('/api/g/countries').toPromise()
  }
}
