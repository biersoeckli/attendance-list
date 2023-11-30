import { Component, OnInit } from '@angular/core';
import { AntraegeService } from '../services/antraege.service';

@Component({
  selector: 'app-decision-board',
  templateUrl: './decision-board.page.html',
  styleUrls: ['./decision-board.page.scss'],
})
export class DecisionBoardPage implements OnInit {

  isLoading = false;
  currentAntrag: any;
  constructor(public antraegeService: AntraegeService) { }

  ngOnInit() {
    this.loadNextAntrag();
  }

  loadNextAntrag() {
    if (!this.antraegeService.allAntraege || this.antraegeService.allAntraege.length === 0) {
      this.currentAntrag = undefined;
    } else {
      this.currentAntrag = this.antraegeService.allAntraege[0];
    }
  }

  async ablehnen() {
    this.isLoading = true;
    await this.antraegeService.denyAntrag(this.currentAntrag);
    this.loadNextAntrag();
    this.isLoading = false;
  }

  async bewilligen() {
    this.isLoading = true;
    await  this.antraegeService.apporveAntrag(this.currentAntrag);
    this.loadNextAntrag();
    this.isLoading = false;
  }

}
