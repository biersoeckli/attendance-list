import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
  selector: 'app-emergency-list',
  templateUrl: './emergency-list.component.html',
  styleUrls: ['./emergency-list.component.scss']
})
export class EmergencyListComponent implements OnInit {

  emergencyContacts: Parse.Object<Parse.Attributes>[];

  constructor() { }

  async ngOnInit() {
    const query = new Parse.Query('emergencyList');
    query.ascending('order');
    this.emergencyContacts = await query.find();
  }

  async call(item: Parse.Object<Parse.Attributes>) {
    const phone = item.get('phone');
    window.open('tel:' + phone);
  }

}
