import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderOverviewPageRoutingModule } from './order-overview-routing.module';

import { OrderOverviewPage } from './order-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderOverviewPageRoutingModule
  ],
  declarations: [OrderOverviewPage]
})
export class OrderOverviewPageModule {}
