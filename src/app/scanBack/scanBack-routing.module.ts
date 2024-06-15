import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanBackPage } from './scanBack.page';

const routes: Routes = [
  {
    path: '',
    component: ScanBackPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanBackPageRoutingModule {}
