import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) { }
  public href: string = "";
  buttonName = "Go to Online Version";
  ngOnInit(): void {
    if (window.location.href == "http://localhost:4200/" || window.location.href == "http://localhost:4200") {
      this.buttonName = "Go to Online Version";
    } else {
      this.buttonName = "Go to Main page"
    }
  }

  onLocalClick() {
    this.router.navigate(['/upload/'], {})
  }

  goToMainPage() {
    this.href = window.location.href;
    // this.href = this.router.url;
    if (this.href == "http://localhost:4200/") {
      this.document.location.href = 'https://caustator.herokuapp.com/';
    } else {
      this.router.navigate(['/upload/'], {})
    }
    console.log(this.href)
  }
}
