import { Component, OnInit } from '@angular/core';
import { AntraegeService } from '../services/antraege.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  ranking: any;

  constructor(private antragService: AntraegeService) { }

  async ngOnInit() {
    this.ranking = await this.antragService.getRanking();
  }

}
