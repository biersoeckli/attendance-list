import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public allProducts: any[];
  constructor() { }

  async loadAllProducts() {
    const GameScore = Parse.Object.extend('BFA_Products');
    const query = new Parse.Query(GameScore);
    query.ascending('name');
    query.limit(10000);
    this.allProducts = await query.find();
  }

  async getAllProducts() {
    if (!this.allProducts || this.allProducts.length === 0) {
      await this.loadAllProducts();
    }
    return this.allProducts;
  }

  public getProductById(id: string) {
    return this.allProducts.find(x => x.id === id);
  }
}
