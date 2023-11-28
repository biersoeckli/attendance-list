import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as Parse from 'parse';
import Swal from 'sweetalert2';
import { UserRoles } from "../entities/user-roles";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class GeolocationService {
    geoWatchId: number;
    isInitialized = false;
    errorMessageShowedOnce = false;

    constructor(private snackbar: MatSnackBar) {

    }
    async initializeIfAllowed() {
        if (this.isInitialized) {
            return;
        }
        const isUserAllowed = await UserService.isUserInRole(Parse.User.current(), UserRoles.geoTracking);
        if (!isUserAllowed || !Parse.User.current()) {
            console.log('Geo-Tracking wont be enabled, because user is not in role "geo-tracking"');
            return;
        }
        const currentUser = await Parse.User.current()?.fetch();
        if (!currentUser) {
            return;
        }

        this.isInitialized = true;
        if (!currentUser.get('geoTrackingActive')) {
            Swal.fire({
                title: 'Geo Tracking',
                text: 'Du wirst gleich eine Meldung erhalten, dass diese Website deinen Standort ermitteln will.' +
                    ' Der Standort wird benötigt, um alle AdA auf einer Karte darzustellen. Der Standort wird nur ermittelt, wenn dein Handy entsperrt ist und du diese Seite geöffnet hast.',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                currentUser.set('geoTrackingActive', true);
                currentUser.save();
                this.initGeoLocation();
            });
        } else {
            this.initGeoLocation();
        }
    }

    private initGeoLocation() {
        if (this.geoWatchId) {
            console.log('Geolocation already initialized');
            return;
        }
        console.log('Initializing geolocation');
        /* geolocation is available */
        const options = {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        };

        this.geoWatchId = navigator.geolocation.watchPosition((position) => {
            console.log('Aktualisierte Geo-Location:');
            console.log(position);
            this.updateLocation(position);
        }, (error) => {
            console.log(error);
            if (!this.errorMessageShowedOnce) {
                this.snackbar.open('Fehler bei der Standortermittlung', null, {
                    duration: 2000
                });
            }
            this.errorMessageShowedOnce = true;
        }, options);
        localStorage.setItem('geolocationEnabled', 'true');
    }

    async updateLocation(position) {
        if (!Parse.User.current()) {
            return;
        }
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const GameScore = Parse.Object.extend("locationStatus");
        const gameScore = new GameScore();
        gameScore.set("user", Parse.User.current());
        gameScore.set("latitude", latitude);
        gameScore.set("longitude", longitude);
        await gameScore.save();
    }

    async getLatestLocationOfUser(user) {
        const GameScore = Parse.Object.extend("locationStatus");
        const query = new Parse.Query(GameScore);
        query.equalTo("user", user);
        query.descending('createdAt')
        query.limit(1);
        const results = await query.find();
        console.log(results);

        if (results.length === 1) {
            return results[0];
        }
        return undefined;
    }
}