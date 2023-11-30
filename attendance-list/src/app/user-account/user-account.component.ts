import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { StatusService } from '../services/status.service';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserStatus } from '../entities/userStatus';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartmentService } from '../services/department.service';
import { GeolocationService } from '../services/geo-location.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  myControl = new UntypedFormControl();
  deptControl = new UntypedFormControl();
  filteredOptions: Observable<any>;
  filteredDept: Observable<any>;

  stellvertreter: any;
  allUsers: any;
  allDepts: any;
  currentUser: any;
  currentUserJson: any; // Used for binding to input
  currentStatus: any;
  status: any;
  currentDept: any;

  showLoader: boolean;

  constructor(public userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    public readonly geoService: GeolocationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      // Initializing filter for stv

      this.userService.allUserStatus.subscribe(async data => {
        if (data && !this.currentUser) { // Data shouldnt be actualized while user is editing information. --> Data Fetch only once

          this.currentUser = params.id ? data.find(x => x.user.id === params.id).user : (await Parse.User.current().fetch());

          this.currentUserJson = this.currentUser.toJSON();
          this.loadData();

          this.allUsers = data.map(x => x.user);
          this.stellvertreter = this.userService.getStellvertreter(this.currentUser);
          this.currentDept = this.userService.getDept(this.currentUser);

          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              map(value => typeof value === 'string' ? value : value.attributes.firstname + ' ' + value.attributes.lastname),
              map(name => name ? this._filter(name) : this.allUsers.slice())
            );


          this.showLoader = false;
        }
      });
    });
    this.departmentService.deptSubject.subscribe(dept => {
      this.allDepts = dept;
      this.filteredDept = this.deptControl.valueChanges
        .pipe(
          // startWith(''),
          map(value => typeof value === 'string' ? value : value.attributes.department),
          map(name => name ? this._filterDept(name) : this.allDepts.slice())
        );
    });
  }

  async loadData() {
    this.showLoader = true;

    // Cleanup?
    const statusQuery = new Parse.Query('status');
    this.status = await statusQuery.find();
    this.currentStatus = await this.userService.getStatusForUser(this.currentUser);

    this.showLoader = false;
  }

  async onProfilePicrutePicked(file: any) {
    try {

      if (!file.type.includes('image')) {
        this.snackbar.open('Ungültiges Bild', null, {
          duration: 2000
        });
        return;
      }

      const parseFile = new Parse.File("profileimage.png", { base64: file.content });
      this.currentUser.set('profilePicture', parseFile);
      await this.currentUser.save();

      this.snackbar.open('Bild aktualisiert', null, {
        duration: 2000
      });

    } catch (ex) {
      console.error(ex);
      this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
        duration: 2000
      });
    }
  }

  updateStv() {
    if (typeof this.stellvertreter === 'string') {
      // sometimes this variable is a string... wtf
      if (this.stellvertreter === '') {
        console.log('Deletting stv because it has no input.');
        this.currentUser.set('stv', null);
        // this.saveCurrentState();
      }
    } else {
      if (!this.currentUser.attributes.stv || this.stellvertreter.id !== this.currentUser.attributes.stv.id) {
        this.currentUser.set('stv', this.stellvertreter);
        // this.saveCurrentState();
      }
    }
  }

  updateDept() {
    if (typeof this.currentDept === 'string') {
      // sometimes this variable is a string... wtf
    } else {
      this.currentUser.set('department', this.currentDept);
      // this.saveCurrentState();
    }
  }
  async saveCurrentState() {

    this.showLoader = true;

    try {

      if (this.currentUserJson.username) {
        this.currentUserJson.username = this.currentUserJson.username.split(' ').join('');
      }
      // this.currentUserJson.username = this.currentUserJson.username.toLowerCase();

      if (this.currentUserJson.telefoneNumber) {
        this.currentUserJson.telefoneNumber = this.currentUserJson.telefoneNumber.split(' ').join('');
        this.currentUserJson.telefoneNumber = this.currentUserJson.telefoneNumber.toLowerCase();
      }

      this.currentUser.set('status', this.currentStatus);

      this.currentUser.set('username', this.currentUserJson.username);
      this.currentUser.set('grad', this.currentUserJson.grad);
      this.currentUser.set('email', this.currentUserJson.email);
      this.currentUser.set('position', this.currentUserJson.position);
      this.currentUser.set('firstname', this.currentUserJson.firstname);
      this.currentUser.set('lastname', this.currentUserJson.lastname);
      this.currentUser.set('telefoneNumber', this.currentUserJson.telefoneNumber);
      await this.currentUser.save();


      this.snackbar.open('Profil aktualisiert', null, {
        duration: 2000
      });

    } catch (ex) {
      console.error(ex);
      this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
        duration: 2000
      });
    }
    this.showLoader = false;
  }

  async changePassword() {
    Swal.fire({
      title: 'Passwort ändern',
      text: 'Geben Sie das neue Passwort ein:',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Sichern',
      cancelButtonText: 'Abbrechen',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        this.currentUser.set('password', result.value);
        this.currentUser.save().then(x => {
          this.snackbar.open('Passwort wurde geändert', null, {
            duration: 2000
          });
        }).catch(err => {
          this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
            duration: 3000
          });
        });
      }
    });
  }

  // Filter functions for autocomplete stv
  displayFn(user: any): string {
    return user && user.attributes ? user.attributes.firstname + ' ' + user.attributes.lastname : '';
  }

  displayDept(dept: any): string {
    return dept && dept.attributes ? dept.attributes.department : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.allUsers.filter(option => {
      let firstLastName = option.attributes.firstname + option.attributes.lastname;
      firstLastName = firstLastName.split(' ').join('');
      return firstLastName.toLowerCase().includes(filterValue.split(' ').join(''));
    });
  }

  private _filterDept(name: string) {
    const filterValue = name.toLowerCase();

    return this.allDepts.filter(option => {
      let deptFilter = option.attributes.department;
      deptFilter = deptFilter.split(' ').join('');
      return deptFilter.toLowerCase().includes(filterValue.split(' ').join(''));
    });
  }
}
