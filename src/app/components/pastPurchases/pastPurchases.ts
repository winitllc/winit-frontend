import { Component } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";
import { model, view } from 'wuzinit-common';

@IonicPage()
@Component({
  selector: 'wuzinit-past-purchases',
  templateUrl: 'pastPurchases.html'
})
export class PastPurchasesComponent {

  inAppPurchaseConfirmations: model.InAppPurchaseConfirmation[];
  premiumFeaturePurchaseConfirmations: model.PremiumFeaturePurchaseConfirmation[];

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.inAppPurchaseConfirmations = this.navParams.get('inAppPurchaseConfirmations');
    this.premiumFeaturePurchaseConfirmations = this.navParams.get('premiumFeaturePurchaseConfirmations');
  }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }
}
