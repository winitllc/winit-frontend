import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScanPage } from './scan.page';

import { ScanPageRoutingModule } from './scan-routing.module';
import { ScanCropperModalPage } from './scan-cropperModal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScanPageRoutingModule,
    ScanCropperModalPage
  ],
  declarations: [ScanPage]
})
export class ScanPageModule {}
