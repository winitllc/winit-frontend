import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterMenuComponent } from './filterMenu';

@NgModule({
  declarations: [
    FilterMenuComponent,
  ],
  imports: [
    IonicPageModule.forChild(FilterMenuComponent),
  ],
  exports: [
    FilterMenuComponent
  ]
})
export class FilterMenuModule {}
