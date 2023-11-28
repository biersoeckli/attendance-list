import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  basketProducts: any[];
  totalAmount: number = 0;
  android: boolean;

  constructor(public basketService: BasketService,
    public platform: Platform,
    public alertController: AlertController,
    private router: Router) {
    this.basketService.basketSubject.subscribe(x => {
      if (x != null) {
        this.basketProducts = x;
        this.totalAmount = x.reduce((sum, current) => sum + current.attributes.price, 0);
      }
    });

    this.android = platform.is('android');
  }

  async order() {
    const alert = await this.alertController.create({
      header: 'Bisch der sicher?',
      message: `Willst du diesen Einkauf von ${this.totalAmount} CHF wirklich tätigen?`,
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ja',
          handler: () => {
            this.basketService.placeOrder().then(() => {
              this.router.navigateByUrl('/tabs/tab3');
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
