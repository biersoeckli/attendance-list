import { Component, OnInit } from '@angular/core';
// import * as CanvasJS from 'canvasjs';
import { UserService } from '../services/user.service';
import { UserStatus } from '../entities/userStatus';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  userData: UserStatus[];

  constructor(private userService: UserService) {

    this.userService.allUserStatus.subscribe(data => {
      if (data) {
        this.userData = data;
        // this.initChart();
      }
    });

  }

  ngOnInit(): void {
  }
/*
  private initChart() {

    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      title: {
        text: 'Email Categories',
        horizontalAlign: 'left'
      },
      data: [{
        type: 'doughnut',
        startAngle: 60,
        // innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: '{label} - #percent%',
        toolTipContent: '<b>{label}:</b> {y} (#percent%)',
        dataPoints: [
          { y: 67, label: 'Inbox' },
          { y: 28, label: 'Archives' },
          { y: 10, label: 'Labels' },
          { y: 7, label: 'Drafts' },
          { y: 15, label: 'Trash' },
          { y: 6, label: 'Spam' }
        ]
      }]
    });
    chart.render();
  }*/
}
