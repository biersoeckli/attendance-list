import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { ScannerPageRoutingModule } from './scanner-routing.module';
import { ScannerPage } from './scanner.page';
import { Demo } from './barcode-scanner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerPageRoutingModule,
    BarcodeScannerLivestreamModule
  ],
  declarations: [ScannerPage, Demo],
  bootstrap: [Demo]
})
export class ScannerPageModule {}
