import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  statusQuery = new Parse.Query('status');

  statusSubject = new BehaviorSubject(null);

  status: Parse.Object<Parse.Attributes>[];


  constructor() {
    this.statusQuery.find().then(status => {
      this.status = status;
      this.sendStatus();
    });
   }

   sendStatus() {
     this.statusSubject.next(this.status);
   }


}
