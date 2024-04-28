import { Component } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";
import { model, view } from 'wuzinit-common';

@IonicPage()
@Component({
  selector: 'wuzinit-in-app-purchase-receipt',
  templateUrl: 'inAppPurchaseReceipt.html'
})
export class InAppPurchaseReceipt {

  receipt: model.InAppPurchaseConfirmation;
  product: view.InAppPurchaseProduct;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.receipt = this.navParams.get('receipt');
    this.product = this.navParams.get('product');
  }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }
}
