import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PastPurchasesComponent } from './pastPurchases';

@NgModule({
  declarations: [
    PastPurchasesComponent,
  ],
  imports: [
    IonicPageModule.forChild(PastPurchasesComponent),
  ],
  exports: [
    PastPurchasesComponent
  ]
})
export class PastPurchasesComponentModule {}
