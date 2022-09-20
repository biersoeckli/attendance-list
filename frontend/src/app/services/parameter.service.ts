import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  parameters: Parse.Object<Parse.Attributes>[];

  constructor() { }

  public async getParams(forceFetch = false) {
    if (!this.parameters || forceFetch) {
      const GameScore = Parse.Object.extend('parameter');
      const query = new Parse.Query(GameScore);
      this.parameters = await query.find();
    }
    return this.parameters;
  }

  public async getParameterValueByKey(key: string) {
    const param = await this.getParameterByKey(key);
    if (param) {
      return param.attributes.value;
    }
    return null;
  }

  public async getParameterByKey(key: string) {
    return (await this.getParams()).find(x => x.attributes.key === key);
  }

  public async saveParameter(param: any) {
    try {
      await param.save();
      await this.getParams(true);
      return true;
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }
}
