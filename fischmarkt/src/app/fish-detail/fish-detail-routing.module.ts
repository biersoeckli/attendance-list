import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FishDetailPage } from './fish-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FishDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FishDetailPageRoutingModule {}
