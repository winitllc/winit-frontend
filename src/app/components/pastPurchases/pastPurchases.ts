import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { model, view } from 'wuzinit-common';

@Component({
  selector: 'wuzinit-past-purchases',
  templateUrl: './pastPurchases.html'
})
export class PastPurchasesComponent {

  inAppPurchaseConfirmations: model.InAppPurchaseConfirmation[];
  premiumFeaturePurchaseConfirmations: model.PremiumFeaturePurchaseConfirmation[];

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.inAppPurchaseConfirmations = this.navParams.get('inAppPurchaseConfirmations');
    this.premiumFeaturePurchaseConfirmations = this.navParams.get('premiumFeaturePurchaseConfirmations');
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }
}
