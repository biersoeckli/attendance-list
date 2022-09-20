import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as Parse from 'parse';
import { UserService } from '../services/user.service';
import { UserRoles } from '../entities/user-roles';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Output()
  closeNav = new EventEmitter();
  isAdmin: boolean;
  isBFAUser = false;
  isFmUser = false;
  isGeoLocationUser = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.isLoggedInUserInRole(UserRoles.admin).then(x => {
      this.isAdmin = x;
    }).catch(error => {
      console.error(error);
    });

    this.userService.isLoggedInUserInRole(UserRoles.bfaUser).then(x => {
      this.isBFAUser = x;
    }).catch(error => {
      console.error(error);
    });

    this.userService.isLoggedInUserInRole(UserRoles.geoTracking).then(x => {
      this.isGeoLocationUser = x;
    }).catch(error => {
      console.error(error);
    });

    this.userService.isLoggedInUserInRole(UserRoles.fmUser).then(x => {
      this.isFmUser = x;
    }).catch(error => {
      console.error(error);
    });
  }


  async logout() {
    Parse.User.logOut().then(() => {
      window.open('/login', '_self');
    });
  }

  async openBfa() {
    const currentUser = await Parse.User.current().fetch();
    window.open(environment.bfaAuthUrl + currentUser.getSessionToken(), '_self');
  }


  async openFischmarkt() {
    const currentUser = await Parse.User.current().fetch();
    window.open(environment.fischmarktAuthUrl + currentUser.getSessionToken(), '_self');
  }

  onClick() {
    this.closeNav.emit(null);
  }

}
