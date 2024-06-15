import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: 'scan',
    loadChildren: () => import('../scan/scan.module').then(m => m.ScanPageModule)
  },
  {
    path: '',
    component: ProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
