import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import * as Parse from 'parse';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  currentUser: any;

  constructor(public orderService: OrderService) {
     Parse.User.current().fetch().then(x => {
      this.currentUser = x;
    });
  }

}
