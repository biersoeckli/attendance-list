import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from 'parse';

@Component({
  selector: 'app-skill-share-edit',
  templateUrl: './skill-share-edit.component.html',
  styleUrl: './skill-share-edit.component.scss'
})
export class SkillShareEditComponent implements OnInit {

  contactUnitSelected?: string;
  skillPost?: Parse.Object;

  constructor(private readonly router: Router) { }

  onSubmit(ev) {
    this.skillPost.set('title', ev.target.title.value);
    this.skillPost.set('description', ev.target.description.value);
    this.skillPost.set('contactName', ev.target.contactName.value);
    this.skillPost.set('contactPhone', ev.target.contactPhone.value);
    this.skillPost.set('contactUnit', this.contactUnitSelected);
    this.save();
  }


  async ngOnInit() {
    const SkillPost = Parse.Object.extend('SkillSharePost');
    this.skillPost = new SkillPost();
  }

  async save() {
    try {
      await this.skillPost.save();
      alert('Dein Beitrag wurde gespeichert. Sobald er freigegeben wurde, erscheint er in der Übersicht (ca. 1 Tag bearbeitungszeit).')
      this.router.navigateByUrl('/skill-share');
    } catch (ex) {
      alert('Fehler: Bitte überprüfe deine Eingaben.')
    }
  }

}
