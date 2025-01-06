import { InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'offReUsePolicyModalComponent.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  selector: 'offPolicy',
  styleUrls: ['offReUsePolicyModalComponent.page.scss']
})
export class OFFReUsePolicyModalComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    console.log(`OFFReUsePolicyModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`OFFReUsePolicyModalComponent.ngAfterViewIn after view init`);
  }

  public ngOnDestroy(): void {
    console.log(`OFFReUsePolicyModalComponent.ngOnDestroy: destroying view`);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  accept() {
    return this.modalCtrl.dismiss(null, 'accept');
  }
}
