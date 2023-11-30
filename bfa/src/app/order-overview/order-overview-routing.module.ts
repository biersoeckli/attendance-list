import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderOverviewPage } from './order-overview.page';

const routes: Routes = [
  {
    path: '',
    component: OrderOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderOverviewPageRoutingModule {}
