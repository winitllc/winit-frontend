import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { model } from 'wuzinit-common';
import { PremiumFeatureView } from '../../util/premiumFeature.view';

@Component({
  selector: 'wuzinit-premium-feature-purchase-confirmation',
  templateUrl: 'premiumFeaturePurchaseConfirmation.html'
})
export class PremiumFeaturePurchaseConfirmation {

  premiumFeatureConfirmation: model.PremiumFeaturePurchaseConfirmation;
  premiumFeature: PremiumFeatureView;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.premiumFeatureConfirmation = this.navParams.get('premiumFeatureConfirmation');
    this.premiumFeature = this.navParams.get('premiumFeature');
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }
}
