import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import * as Parse from 'parse';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  totalBatSaldo: number;
  totalBestellungen: number;

  constructor(private orderService: OrderService,
    private userService: UserService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.calculateTotalBatSaldo();
  }

  async calculateTotalBatSaldo() {
    const allOrderProducts = await this.orderService.getAllOrderProducts();
    let total = 0;
    for (const item of allOrderProducts) {
      total += item.get('product')?.get('price') ?? 0;
    }
    this.totalBatSaldo = total;
    this.totalBestellungen = allOrderProducts.length;
  }

  async saldoFuerBenutzerZuruecksetzen() {
    const allUsers = await this.userService.getUsersWithOrders();

    let counter = 0;
    let alert;
    const alertControllerInputs = allUsers.map(user => {
      counter++;
      return {
        name: 'radio' + counter,
        type: 'radio',
        label: `${user?.get('grad')} ${user?.get('firstname')} ${user?.get('lastname')}`.trim() || 'Unbekannt',
        value: user.id,
        handler: () => {
          this.resetUserSaldo(user);
          alert.dismiss();
        }
      } as any;
    });
    alert = await this.alertController.create({
      header: 'Wähle einen Benutzer',
      inputs: alertControllerInputs,
    });

    await alert.present();
  }

  async resetUserSaldo(user: any) {
    try {
      if (!confirm(`Saldo von ${user.get('firstname')} ${user.get('lastname')} zurücksetzen?`)) {
        return;
      }
      await Parse.Cloud.run('resetBfaSaldo', { userId: user.id });
      alert(`Saldo von ${user.get('firstname')} ${user.get('lastname')} erfolgreich zurückgesetzt.`);
    } catch (ex) {
      alert('Es ist ein Fehler aufgetreten.');
      console.error(ex);
    }
  }

  async createSaldoReportByUserId() {
    try {
      const allOrders = await this.orderService.getAllOrders();

      const grouped = this.groupOrdersByUser(allOrders);

      const csvModel = [];

      for (const groupName in grouped) {

        const itemGroup = grouped[groupName];
        const item = itemGroup[0];

        const totalAmount = itemGroup.reduce((sum, current) => sum + current.get('amount'), 0);

        const user = item.get('user');
        csvModel.push({
          Grad: user?.get('grad') ?? 'Unbekannt',
          Vorname: user?.get('firstname') ?? 'Unbekannt',
          Nachname: user?.get('lastname') ?? 'Unbekannt',
          Preis: totalAmount,
        });
      }

      this.createCsv(csvModel);

    } catch (ex) {
      console.error(ex);
      alert('Es ist ein Fehler aufgetreten.');
    }
  }

  async createSaldoReportByOrders() {
    try {
      const allOrders = await this.orderService.getAllOrders();
      const csvModel = [];

      for (const item of allOrders) {
        const user = item.get('user');
        csvModel.push({
          Grad: user?.get('grad'),
          Vorname: user?.get('firstname'),
          Nachname: user?.get('lastname'),
          Kaufdatum: item.get('orderedAt').toLocaleString()?.replace(',', ''),
          Preis: item.get('amount'),
        });
      }

      this.createCsv(csvModel);

    } catch (ex) {
      console.error(ex);
      alert('Es ist ein Fehler aufgetreten.');
    }
  }

  createCsv(data: any) {

    const csvConfig = mkConfig({ 
      useKeysAsHeaders: true,
      fieldSeparator: ';',
      quoteStrings: false,
      decimalSeparator: '.',
     });

     // legacy
    const options = {
      fieldSeparator: ';',
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'report-download.csv',
      useTextFile: false,
      useBom: false,
      useKeysAsHeaders: true,
    };
    /*
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);*/

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  }

  groupOrdersByUser(xs) {
    return xs.reduce((rv, x) => {
      (rv[x.attributes.user?.id ?? 'unknown'] = rv[x.attributes.user?.id ?? 'unknown'] || []).push(x);
      return rv;
    }, {});
  }
}
