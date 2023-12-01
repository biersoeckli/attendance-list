import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { UserStatus } from '../entities/userStatus';
import * as Parse from 'parse';
import { UserRoles } from '../entities/user-roles';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';
import { StatusService } from '../services/status.service';
import { GeolocationService } from '../services/geo-location.service';
import * as L from 'leaflet';
@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

  currentUserStatus: UserStatus;
  stv: any;
  isAdmin: boolean;
  profileIsfromCurrentUser: boolean;
  currentDepartment: any;
  allStatus: any[];
  latestLocation: any;
  locationUrl: any;

  @ViewChild('lMap') mapElRef: ElementRef;
  hideLocation: boolean;
  userRoles?: string[];

  constructor(private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private departmentService: DepartmentService,
    private statusService: StatusService,
    private readonly geoService: GeolocationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      try {
        const currentLoggedInUser = await Parse.User.current().fetch();
        this.userService.allUserStatus.subscribe(async data => {
          if (data) {
            this.currentUserStatus = data.find(x => x.user.id === params.id);

            if (this.currentUserStatus == null) {
              this.snackbar.open('Benutzer konnte nicht gefunden werden.', null, {
                duration: 2000
              });
              return;
            }

            this.departmentService.deptSubject.subscribe(dept => {

              if (dept && this.currentUserStatus.user.attributes.department) {
                this.currentDepartment = dept.find(x => x.id === this.currentUserStatus.user.attributes.department.id);
              }
            });
            this.userService.isLoggedInUserInRole(UserRoles.admin).then(res => this.isAdmin = res);
            this.profileIsfromCurrentUser = currentLoggedInUser.id === this.currentUserStatus.user.id;
            this.stv = this.userService.getStellvertreterUserStatus(this.currentUserStatus.user);

            this.userRoles = await Parse.Cloud.run('getRolesFromUser', { userId: this.currentUserStatus.user.id });

            await this.initLocationMap();
          }
        });

      } catch (ex) {
        this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
          duration: 2000
        });
        console.error(ex);
      }
    });

    this.statusService.statusSubject.subscribe(status => {
      if (status && !this.allStatus) {
        this.allStatus = status;
      }
    });
  }

  private async initLocationMap() {
    if (!this.currentUserStatus?.user) {
      this.hideLocation = true;
      return;
    }
    console.log('Loading location of user: ' + this.currentUserStatus.user?.id);
    this.latestLocation = await this.geoService.getLatestLocationOfUser(this.currentUserStatus.user);
    if (!this.latestLocation) {
      this.hideLocation = true;
      return;
    }

    var mapOptions = {
      center: [this.latestLocation.get('latitude'), this.latestLocation.get('longitude')],
      zoom: 15
    };
    // Creating a map object
    const map = new L.map(this.mapElRef.nativeElement, mapOptions);

    // Creating a Layer object
    const layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    var markerIcon = L.icon({
      iconUrl: '/assets/images/minion_marker.png',
      iconSize: [38, 58], // size of the icon
      //shadowSize:   [50, 64], // size of the shadow
      iconAnchor: [22, 58], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([this.latestLocation.get('latitude'), this.latestLocation.get('longitude')], { icon: markerIcon }).addTo(map);

    // Adding layer to the map
    map.addLayer(layer);
  }


  async toggleStatus() {

    if (this.isAdmin) {

      let nextStatusIndex = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.allStatus.length; i++) {
        if (this.allStatus[i].id === this.currentUserStatus.status.id) {
          nextStatusIndex = i === (this.allStatus.length - 1) ? 0 : i + 1;
        }
      }

      Parse.Cloud.run('setStatus', {
        userId: this.currentUserStatus.user.id,
        newStatusId: this.allStatus[nextStatusIndex].id
      }).then(result2 => {

        // this.currentUserStatus.status = this.allStatus[nextStatusIndex];
        this.snackbar.open('Status aktualisiert.', null, {
          duration: 4000
        });

      }).catch(err => {
        this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
          duration: 3000
        });
      });
    }
  }


  async removeRole(roleName: string) {
    Swal.fire({
      title: 'Willst du die Rolle wirklich entfernen?',
      showCancelButton: true,
      confirmButtonText: 'Ja',
      cancelButtonText: 'Nein',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        Parse.Cloud.run('removeRoleFromUser', { roleName, userId: this.currentUserStatus.user.id }).then(async result2 => {

          this.snackbar.open('Rolle wurde entfernt.', null, {
            duration: 4000
          });
          this.userRoles = await Parse.Cloud.run('getRolesFromUser', { userId: this.currentUserStatus.user.id });

        }).catch(err => {
          this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
            duration: 3000
          });
        });
      }
    });

  }

  async deleteUser() {
    Swal.fire({
      title: 'Willst du diesen Benutzer wirklich löschen?',
      showCancelButton: true,
      confirmButtonText: 'Ja',
      cancelButtonText: 'Nein',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        Parse.Cloud.run('deleteUser', { user2delete: this.currentUserStatus.user.id }).then(result2 => {

          this.snackbar.open('Benutzer wurde gelöscht.', null, {
            duration: 4000
          });
          this.router.navigateByUrl('/minions');
        }).catch(err => {
          this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
            duration: 3000
          });
        });
      }
    });

  }

  async addRoleToUser() {


    const query = new Parse.Query('_Role');
    const roles = await query.find();

    const roleNames = roles.map(x => x.get('name'));
    const filteredRoles = roleNames.filter(x => !this.userRoles.includes(x));
    const inputOptionsMap = new Map();
    filteredRoles.forEach(x => inputOptionsMap.set(x, x));

    Swal.fire({
      title: 'Rolle hinzufügen',
      text: 'Wählen Sie eine Rolle:',
      input: 'select',
      inputOptions: inputOptionsMap,
      showCancelButton: true,
      confirmButtonText: 'Hinzufügen',
      cancelButtonText: 'Abbrechen',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        Parse.Cloud.run('addUserToRole', { roleName: result.value, userId: this.currentUserStatus.user.id }).then(async result2 => {
          this.snackbar.open('Rolle "' + result.value + '" wurde hinzugefügt', null, {
            duration: 2000
          });
          this.userRoles = await Parse.Cloud.run('getRolesFromUser', { userId: this.currentUserStatus.user.id });
        }).catch(err => {
          this.snackbar.open('Es ist ein Fehler aufgetreten', null, {
            duration: 3000
          });
        });
      }
    });
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
        Parse.Cloud.run('changePassword', { userId: this.currentUserStatus.user.id, newPassword: result.value }).then(result2 => {

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

}
