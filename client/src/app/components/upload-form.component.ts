import { Component, OnInit } from '@angular/core';
import { Country } from '../models';
import { FormService } from '../services/form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {

  countries: Country[] = [
    { name: 'Singapore', code: 'sg'},
    { name: 'Malaysia', code: 'my'},
    { name: 'United States of America', code: 'us'},
    { name: 'Japan', code: 'jp'},
    { name: 'Russia', code: 'ru'},
    { name: 'United Kingdom', code: 'uk'},
  ];

  constructor(private router: Router, 
    private formSvc: FormService) { }

  ngOnInit() {
    this.getListOfCountries();
  }

  dismiss() {
    this.router.navigate(['/']);
  }

  private getListOfCountries() {
    this.formSvc.getListOfCountries()
    .then(result => {
      this.countries = result;
    })
    .catch(err => {
      console.log('Error: ', err);
    })
  }
}
