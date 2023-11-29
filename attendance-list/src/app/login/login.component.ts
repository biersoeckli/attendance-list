import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { Router } from '@angular/router';
import { LoginModel } from '../entities/loginModel';
import { UserService } from '../services/user.service';
import { StatusService } from '../services/status.service';
import { ParameterService } from '../services/parameter.service';
import { Parameter } from '../constants/parameter';
import { UserRoles } from '../entities/user-roles';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isRegistration: boolean;
  registrationIsEnabled: boolean;

  registrationCode: string;

  loginInProgress: boolean;
  errorMessage: string;
  loginModel: LoginModel;

  constructor(private router: Router,
              private paramService: ParameterService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginInProgress = false;
    this.isRegistration = false;
    this.loginModel = new LoginModel();

    const currentUser = Parse.User.current();
    if (currentUser) {
      this.router.navigateByUrl('/');
    } else {
      this.registrationIsEnabled = false;
      this.paramService.getParameterValueByKey(Parameter.allowUserRegistrations).then(val => this.registrationIsEnabled = (val === 'true'));
      this.paramService.getParameterValueByKey(Parameter.registrationCode).then(val => this.registrationCode = val);
    }
  }

  formatUsername() {
    if (this.isRegistration) {
      this.loginModel.username = this.loginModel.username.split(' ').join('');
      // this.loginModel.username = this.loginModel.username.toLowerCase();
    }
  }

  async login() {

    this.errorMessage = '';
    this.loginInProgress = true;

    try {

      if (this.isRegistration && this.registrationIsEnabled) {
        if (this.loginModel.registercode === this.registrationCode) {

          const user = new Parse.User();
          user.set('username', this.loginModel.username);
          user.set('password', this.loginModel.password);

          // A default department and default status will be set on serverside.
          // The ACL configuration will also be set on serverside

          await user.signUp();

          window.open(environment.attendanceListBasePath + '/me', '_self');
        } else {
          this.snackbar.open('Registrations Code falsch', null, {
            duration: 2000
          });
          throw new Error();
        }

      } else {
        const user = await Parse.User.logIn(this.loginModel.username, this.loginModel.password);
        location.reload();
      }
    } catch (ex) {
      this.errorMessage = ex.message;
      console.log(ex);
      this.loginInProgress = false;
    }

  }
}
