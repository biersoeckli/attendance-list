import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AntragEditPageRoutingModule } from './antrag-edit-routing.module';

import { AntragEditPage } from './antrag-edit.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AntragEditPageRoutingModule,
    ExploreContainerComponentModule
  ],
  declarations: [AntragEditPage]
})
export class AntragEditPageModule {}
