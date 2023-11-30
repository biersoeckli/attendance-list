import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AntraegeService } from '../services/antraege.service';

@Component({
  selector: 'app-fish-detail',
  templateUrl: './fish-detail.page.html',
  styleUrls: ['./fish-detail.page.scss'],
})
export class FishDetailPage implements OnInit {
  antraege: any[];

  constructor(private antragService: AntraegeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.antragService.fishysSubject.subscribe(x => {
        this.antraege = x.filter(antr => antr.get('fishType').id === params.fishTypeId);
      });
    });
  }

}
