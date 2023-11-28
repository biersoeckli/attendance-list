import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DecisionBoardPage } from '../decision-board/decision-board.page';
import { AntraegeService } from '../services/antraege.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public antraegeService: AntraegeService,
    public modalController: ModalController) {}

  async openDecisionBoard() {
    const modal = await this.modalController.create({
      component: DecisionBoardPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
