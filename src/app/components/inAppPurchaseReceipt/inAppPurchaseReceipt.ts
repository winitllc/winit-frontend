import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { model, view } from 'wuzinit-common';

@Component({
  selector: 'wuzinit-in-app-purchase-receipt',
  templateUrl: './inAppPurchaseReceipt.html'
})
export class InAppPurchaseReceipt {

  receipt: model.InAppPurchaseConfirmation;
  product: view.InAppPurchaseProduct;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.receipt = this.navParams.get('receipt');
    this.product = this.navParams.get('product');
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }
}
