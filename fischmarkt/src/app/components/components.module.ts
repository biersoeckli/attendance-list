import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntragListItemComponent } from './antrag-list-item/antrag-list-item.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [AntragListItemComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  exports: [AntragListItemComponent]
})
export class ComponentsModule { }
