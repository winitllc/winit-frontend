import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InAppPurchaseReceipt } from './inAppPurchaseReceipt';

@NgModule({
  declarations: [
    InAppPurchaseReceipt,
  ],
  imports: [
    IonicPageModule.forChild(InAppPurchaseReceipt),
  ],
  exports: [
    InAppPurchaseReceipt
  ]
})
export class InAppPurchaseReceiptModule {}
