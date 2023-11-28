import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from 'parse';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params.token) {
        Parse.User.become(params.token).then(user => {
          //    this.router.navigateByUrl('/');
          this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
        }, error => {
          alert('Es ist ein fehler aufgetreten. Versuche es erneut.');
          console.error(error);
        });
      }
    });
  }

}
