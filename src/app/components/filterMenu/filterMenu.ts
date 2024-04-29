import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";

@Component({
  selector: 'wuzinit-filter',
  templateUrl: 'filterMenu.html'
})
export class FilterMenuComponent {

  public toggleFilters: ToggleFilters;
  public resultsPage: boolean = false;

  constructor(
    private modalController: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.toggleFilters = navParams.get('toggleFilters');
    const whichPage = navParams.get('whichPage');
    if (whichPage && whichPage === 'results') {
      this.resultsPage = true;
    } else {
      this.resultsPage = false;
    }
  }

  getAppliedToggleFilters(): ToggleFilters {
    return this.toggleFilters;
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewModalPage');
  }

  applyFilter(): void {
    this.modalController.dismiss({
      toggleFilters: this.toggleFilters
    });
  }

  cancelModal(): void {
    this.modalController.dismiss();
  }
}

export interface ToggleFilters {
  poisonousIngredients: boolean;
  dangerousIngredients: boolean;
}
