//demo.component.ts
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { BasketService } from "../services/basket.service";
import { ProductService } from "../services/product.service";

@Component({
  selector: "demo-app",
  template: `
    <barcode-scanner-livestream
      [type]="['ean', 'ean_8', 'code_39']"
      (valueChanges)="onValueChanges($event)"
      (started)="(onStarted)"
    ></barcode-scanner-livestream>
    <div [hidden]="!barcodeValue">
      {{ barcodeValue }}
    </div>
  `,
})
export class Demo implements AfterViewInit {
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent;

  barcodeValue;
  allProducts: any[];

  constructor(private productService: ProductService,
    private basketService: BasketService,
    private router: Router,
    public alertController: AlertController) {

    this.productService.getAllProducts().then(x => {
      this.allProducts = x;
    })
  }

  ngAfterViewInit() {
    try {
      //this.ask4amount(this.productService.allProducts[0]);
      this.barcodeScanner.start();
    } catch (ex) {
      alert('Es ist ein Fehler aufgetreten. Versuche es bitte erneut.');
    }
  }

  onValueChanges(result) {
    this.barcodeValue = result.codeResult.code;
    const foundAnyProduct = this.allProducts.find(x => x.attributes.barcode === result.codeResult.code);
    if (foundAnyProduct != null) {
      this.barcodeScanner.stop();
      this.ask4amount(foundAnyProduct);
    }
  }

  addItems2Cart(item, count) {

    for (let i = 0; i < count; i++) {
      this.basketService.additem2Basket(item);
    }
    this.router.navigateByUrl('/tabs/tab2');
  }

  async ask4amount(product) {
    const alert = await this.alertController.create({
      header: 'Wähle die Anzahl',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: '1 Stuck',
          value: 1,
          handler: () => {
            this.addItems2Cart(product, 1);
            alert.dismiss();
          }

        },
        {
          name: 'radio2',
          type: 'radio',
          label: '2 Stuck',
          value: 2,
          handler: () => {
            this.addItems2Cart(product, 2);
            alert.dismiss();
          }

        },
        {
          name: 'radio1',
          type: 'radio',
          label: '3 Stuck',
          value: 3,
          handler: () => {
            this.addItems2Cart(product, 3);
            alert.dismiss();
          }

        },
        {
          name: 'radio1',
          type: 'radio',
          label: '4 Stuck',
          value: 4,
          handler: () => {
            this.addItems2Cart(product, 4);
            alert.dismiss();
          }
        },
        {
          name: 'radio1',
          type: 'radio',
          label: '5 Stuck',
          value: 5,
          handler: () => {
            this.addItems2Cart(product, 5);
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  onStarted(started) {
    console.log(started);
  }
}