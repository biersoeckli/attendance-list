import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class FishTypeService {


  allFishTypes: any;
  constructor() { }
  
  public async loadAllFishTypes(): Promise<void> {
    const GameScore = Parse.Object.extend("FM_FishType");
    const query = new Parse.Query(GameScore);
    query.ascending('points');
    query.limit(10000);
    this.allFishTypes = await query.find();
  }
}
