import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-modal',
  templateUrl: 'addProductModal.page.html',
})
export class AddProductModalPage implements OnInit {
  @Input() name: string = "";

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(`AddProductModalPage.constructor: name: ${this.name}`);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
