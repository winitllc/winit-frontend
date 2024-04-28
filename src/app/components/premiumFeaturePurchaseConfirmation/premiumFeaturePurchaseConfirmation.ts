import { Component } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";
import { model } from 'wuzinit-common';
import { PremiumFeatureView } from '../../pages/profile/profile';

@IonicPage()
@Component({
  selector: 'wuzinit-premium-feature-purchase-confirmation',
  templateUrl: 'premiumFeaturePurchaseConfirmation.html'
})
export class PremiumFeaturePurchaseConfirmation {

  premiumFeatureConfirmation: model.PremiumFeaturePurchaseConfirmation;
  premiumFeature: PremiumFeatureView;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.premiumFeatureConfirmation = this.navParams.get('premiumFeatureConfirmation');
    this.premiumFeature = this.navParams.get('premiumFeature');
  }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }
}
