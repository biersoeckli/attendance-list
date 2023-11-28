import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.page.html',
  styleUrls: ['./order-overview.page.scss'],
})
export class OrderOverviewPage implements OnInit {

  order: any;
  products: any[];

  constructor(private orderService: OrderService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.loadorder(params.orderId);
    });
  }

  async loadorder(orderId) {

    this.order = this.orderService.getOrderById(orderId);

    const GameScore = Parse.Object.extend("BFA_OrderProducts");
    const query = new Parse.Query(GameScore);
    query.equalTo('order', this.order);
    query.include('product');
    query.limit(10000);
    const result = await query.find();

    const prodcts = [];
    for (let item of result) {
      prodcts.push(item.get('product'));
    }
    this.products = prodcts;
  }

}
