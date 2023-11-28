import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'empty-placeholder',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() text: string;

  constructor() { }

  ngOnInit() {}

}
