import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AntragEditPage } from './antrag-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AntragEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AntragEditPageRoutingModule {}
