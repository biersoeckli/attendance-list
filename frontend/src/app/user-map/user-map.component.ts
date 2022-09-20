import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import * as Parse from 'parse';
import { GeolocationService } from '../services/geo-location.service';

@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.scss']
})
export class UserMapComponent implements OnInit {

  @ViewChild('lMap') mapElRef: ElementRef;
  showLoader = true;
  datePipe = new DatePipe('en-US');

  constructor(private geoService: GeolocationService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {

    const statusQuery = new Parse.Query('_User');
    const users = await statusQuery.find();

    const einheitenQuery = new Parse.Query('Einheiten');
    const einheiten = await einheitenQuery.find();

    const userLocationPromises = users.map(async user => {
      const location = await this.geoService.getLatestLocationOfUser(user);
      if (!location) {
        return undefined;
      }
      return {
        user,
        location
      } as UserLocation;
    });
    const userLocations = (await Promise.all(userLocationPromises)).filter(x => x);


    var mapOptions = {
      center: [47.452340, 8.864947],
      zoom: 9
    };
    
    const map = new L.map(this.mapElRef.nativeElement, mapOptions);
    const layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    userLocations.forEach(ul =>
      this.addEinheitToMap(map,
        '/assets/images/minion_marker.png',
        `<b>${ul.user.get('grad')} ${ul.user.get('firstname')} ${ul.user.get('lastname')}</b><br>${ul.user.get('position') ?? ""}<br>Zuletzt: ${this.datePipe.transform(ul.location.get('createdAt'), 'dd.MM HH:mm')}`,
        ul.location.get('latitude'),
        ul.location.get('longitude'), 38, 58)
    );

    einheiten.forEach(e => this.addEinheitToMap(map, e.get('imageUrl'), '<b>' + e.get('name') + '</b>', e.get('latitude'), e.get('longitude'), e.get('imageWidth'), e.get('imageHeigth')));

    map.addLayer(layer);
    this.showLoader = false;
  }

  /**
   * Adds a static marker to the map.
   */
  addEinheitToMap(map: any, imagePath: string, name: string, latitude: number, longitude: number, iconW = 60, iconH = 45) {
    var markerIcon = L.icon({
      iconUrl: imagePath,
      iconSize: [iconW, iconH], // size of the icon
      iconAnchor: [iconW, iconH], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-(iconW / 2), -(iconH)] // point from which the popup should open relative to the iconAnchor
    });
    const marker = L.marker([latitude, longitude], { icon: markerIcon });
    marker.bindPopup(name).openPopup();
    marker.addTo(map);
  }

}

interface UserLocation {
  user: any;
  location: any;
}