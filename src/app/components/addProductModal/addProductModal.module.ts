import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductModalComponent } from './addProductModal';

@NgModule({
  declarations: [
    AddProductModalComponent
  ],
  imports: [
    IonicPageModule.forChild(AddProductModalComponent),
  ],
  exports: [
    AddProductModalComponent
  ]
})
export class AddProductModalModule {}
