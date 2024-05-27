import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
  selector: 'app-skill-share-overview',
  templateUrl: './skill-share-overview.component.html',
  styleUrl: './skill-share-overview.component.scss'
})
export class SkillShareOverviewComponent implements OnInit {

  skillPosts?: Parse.Object[];

  constructor() { }

  async ngOnInit() {
    const SkillPost = Parse.Object.extend('SkillSharePost');
    const query = new Parse.Query(SkillPost);
    query.equalTo('public', true);
    query.descending('createdAt');
    this.skillPosts = await query.find();
  }

}