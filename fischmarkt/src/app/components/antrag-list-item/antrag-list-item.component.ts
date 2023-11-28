import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'antrag-list-item',
  templateUrl: './antrag-list-item.component.html',
  styleUrls: ['./antrag-list-item.component.scss'],
})
export class AntragListItemComponent implements OnInit {

  @Input() antrag: any;
  constructor() { }

  ngOnInit() {}

}
