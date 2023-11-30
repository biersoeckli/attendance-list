import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FishDetailPageRoutingModule } from './fish-detail-routing.module';

import { FishDetailPage } from './fish-detail.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FishDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FishDetailPage]
})
export class FishDetailPageModule {}
