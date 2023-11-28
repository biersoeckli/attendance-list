import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FishtasticUtils } from '../fishtastic-utils';
import { AntraegeService } from '../services/antraege.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  groupedFishes: any;
  groupFishNames: string[];

  constructor(public antraegeService: AntraegeService) {
    this.antraegeService.fishysSubject.subscribe(x => {
      this.groupFishes(x);
    });
  }

  groupFishes(antraege: any[]) {
    const fishes = antraege.map(x => x.get('fishType'));

    this.groupedFishes = FishtasticUtils.groupBy(fishes, 'id');

    const ids = [];
    for (let item in this.groupedFishes) {
      ids.push(item);
    }
    this.groupFishNames = ids;
  }

  openReglement() {
    window.open('/assets/Fischerreglement_Spit_Bat_75.pdf', '_self');
  }
  
  openAttendanceList() {
    window.open(environment.attendanceListUrl, '_self');
  }
}
