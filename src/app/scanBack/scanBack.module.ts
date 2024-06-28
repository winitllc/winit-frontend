import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScanBackPage } from './scanBack.page';

import { ScanBackPageRoutingModule } from './scanBack-routing.module';
import { ScanBackCropperModalPage } from './scanBack-cropperModal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScanBackPageRoutingModule,
    ScanBackCropperModalPage
  ],
  declarations: [ScanBackPage]
})
export class ScanBackPageModule {}
