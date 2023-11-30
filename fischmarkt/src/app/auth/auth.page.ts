import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from 'parse';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  username?: string;
  password?: string;
  isLoading = false;

  constructor(private readonly router: Router) { }

  ngOnInit() {
    if (Parse.User.current()) {
      this.router.navigateByUrl('/');
    }
  }

  async login() {
    this.isLoading = true;
    try {
      await Parse.User.logIn(this.username, this.password);
      this.router.navigateByUrl('/');
    } catch (ex) {
      console.error(ex);
      alert('Es ist ein Fehler aufgetreten');
    } finally {
      this.isLoading = false;
    }
  }

}
