import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
// import { AddProductModalPage } from './addProductModal.page';
import { AddProductModalComponent } from '../components/addProductModal/addProductModal';
import { ConfirmSectionModalComponent } from '../components/confirmSectionModal/confirmSectionModal';
import { FilterMenuComponent } from '../components/filterMenu/filterMenu';
import { InAppPurchaseReceipt } from '../components/inAppPurchaseReceipt/inAppPurchaseReceipt';
import { PastPurchasesComponent } from '../components/pastPurchases/pastPurchases';
import { PremiumFeaturePurchaseConfirmation } from '../components/premiumFeaturePurchaseConfirmation/premiumFeaturePurchaseConfirmation';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule
  ],
  declarations: [
    ProductPage,
    AddProductModalComponent,
    ConfirmSectionModalComponent,
    FilterMenuComponent,
    InAppPurchaseReceipt,
    PastPurchasesComponent,
    PremiumFeaturePurchaseConfirmation
  ]
})
export class ProductPageModule {}
