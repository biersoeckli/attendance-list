import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public totalAmount = 0;
  public allOrders: any[];
  constructor() { }

  async loadUserOrders() {
    const currUser = await Parse.User.current().fetch();

    const GameScore = Parse.Object.extend('BFA_Orders');
    const query = new Parse.Query(GameScore);
    query.equalTo('user', currUser);
    query.descending('orderedAt');
    query.limit(100000);
    this.allOrders = await query.find();
    this.totalAmount   = this.allOrders.reduce((sum, current) => sum + current.attributes.amount, 0);
  }

  public getOrderById(id: string) {
    return this.allOrders.find(x => x.id === id);
  }

  async getAllOrders(): Promise<any[]> {
    const GameScore = Parse.Object.extend('BFA_Orders');
    const query = new Parse.Query(GameScore);
    query.descending('orderedAt');
    query.include('user');
    query.limit(100000);
    return await query.find();
  }


  async getAllOrderProducts(): Promise<any[]> {
    const GameScore = Parse.Object.extend('BFA_OrderProducts');
    const query = new Parse.Query(GameScore);
    query.descending('orderedAt');
    query.include('user');
    query.include('product');
    query.limit(100000);
    return await query.find();
  }
}
