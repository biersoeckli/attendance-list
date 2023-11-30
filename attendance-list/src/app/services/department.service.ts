import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  deptQuery = new Parse.Query('department');

  deptSubject = new BehaviorSubject(null);


  dept: Parse.Object<Parse.Attributes>[];


  constructor() {
    this.deptQuery.ascending('order');
    this.deptQuery.find().then(status => {
      this.dept = status;
      this.sendStatus();
    });
   }

   sendStatus() {
     this.deptSubject.next(this.dept);
   }
}
