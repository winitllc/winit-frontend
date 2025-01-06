import { InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'offContributorPolicyModalComponent.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  selector: 'offPolicy',
  styleUrls: ['offContributorPolicyModalComponent.page.scss']
})
export class OFFContributorPolicyModalComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    console.log(`OFFContributorPolicyModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`OFFContributorPolicyModalComponent.ngAfterViewIn after view init`);
  }

  public ngOnDestroy(): void {
    console.log(`OFFContributorPolicyModalComponent.ngOnDestroy: destroying view`);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  accept() {
    return this.modalCtrl.dismiss(null, 'accept');
  }
}
