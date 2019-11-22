import { Component, OnInit } from '@angular/core';
import { Country } from '../models';

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

  constructor() { }

  ngOnInit() {
  }

}
