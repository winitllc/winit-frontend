import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropImageModalComponent } from './cropImageModal';

@NgModule({
  declarations: [
    CropImageModalComponent,
  ],
  imports: [
    ImageCropperModule,
    IonicPageModule.forChild(CropImageModalComponent),
  ],
  exports: [
    CropImageModalComponent
  ]
})
export class CropImageModalComponentModule {}
