import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PremiumFeaturePurchaseConfirmation } from './premiumFeaturePurchaseConfirmation';

@NgModule({
  declarations: [
    PremiumFeaturePurchaseConfirmation,
  ],
  imports: [
    IonicPageModule.forChild(PremiumFeaturePurchaseConfirmation),
  ],
  exports: [
    PremiumFeaturePurchaseConfirmation
  ]
})
export class PremiumFeaturePurchaseConfirmationModule {}
