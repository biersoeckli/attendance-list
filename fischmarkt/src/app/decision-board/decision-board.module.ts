import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DecisionBoardPageRoutingModule } from './decision-board-routing.module';

import { DecisionBoardPage } from './decision-board.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecisionBoardPageRoutingModule
  ],
  declarations: [DecisionBoardPage]
})
export class DecisionBoardPageModule {}
