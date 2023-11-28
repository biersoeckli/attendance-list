import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BasketService } from '../services/basket.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import * as Parse from 'parse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  searchString: any = '';
  products: any[];
  filteredProducts: any[];

  ios: boolean;
  android: boolean;
  isBfaAdmin: boolean;


  constructor(public productService: ProductService, public basketService: BasketService, public platform: Platform) {
    this.ios = platform.is('ios');
    this.android = platform.is('android');
    this.products = productService.allProducts;
    this.searchString = '';
    this.filterProducts();
    UserService.isUserInRole(Parse.User.current(), 'bfa-admin').then(x => this.isBfaAdmin = x);
  }

  filterProducts() {
    if (!this.searchString || this.searchString === '') {
      this.filteredProducts = this.products;
    } else {
      const searchStringg = this.searchString.toLowerCase();
      this.filteredProducts = this.products.filter(x => {
        const itemSearchstring = x.attributes.name.toLowerCase();
        return itemSearchstring.indexOf(searchStringg) > -1;
      });
    }
  }

  async deleteItem(item: any) {
    if (!item || !confirm(`Den Artikel ${item.get('name')} wirklich löschen?`)) {
      return;
    }

    await item.destroy();
    await this.productService.loadAllProducts();
    this.products = this.productService.allProducts;
    this.searchString = '';
    this.filterProducts();
  }

  openAttendanceList() {
    window.open(environment.attendanceListUrl, '_self');
  }
}
