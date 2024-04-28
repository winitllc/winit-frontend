import { Component } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";
import { IngredientsSections } from '../addProductModal/addProductModal';

@IonicPage()
@Component({
  selector: 'wuzinit-confirm-section',
  templateUrl: 'confirmSectionModal.html'
})
export class ConfirmSectionModalComponent {

  public sectionText?: string;
  public ingredientsSections?: IngredientsSections;
  public sectionImageData: String;
  public sectionName: string;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.sectionText = this.navParams.get('sectionText');
    this.ingredientsSections = this.navParams.get('ingredientsSections');
    this.sectionImageData = this.navParams.get('sectionImageData');
    this.sectionName = this.navParams.get('sectionName');
  }

  confirmSection(): void {
    this.viewCtrl.dismiss({
      sectionText: this.sectionText,
      ingredientsSections: this.ingredientsSections,
      sectionImageData: this.sectionImageData
    });
  }

  cancelModal(): void {
    this.viewCtrl.dismiss();
  }
}
