import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmSectionModalComponent } from './confirmSectionModal';

@NgModule({
  declarations: [
    ConfirmSectionModalComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmSectionModalComponent),
  ],
  exports: [
    ConfirmSectionModalComponent
  ]
})
export class ConfirmSectionModalModule {}
