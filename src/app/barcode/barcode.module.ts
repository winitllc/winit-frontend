import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodePage } from './barcode.page';

import { BarcodePageRoutingModule } from './barcode-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BarcodePageRoutingModule
  ],
  declarations: [BarcodePage]
})
export class BarcodePageModule {}
