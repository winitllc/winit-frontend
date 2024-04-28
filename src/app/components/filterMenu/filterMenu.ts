import { Component } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'wuzinit-filter',
  templateUrl: 'filterMenu.html'
})
export class FilterMenuComponent {

  public toggleFilters: ToggleFilters;
  public resultsPage: boolean = false;

  constructor(
    public viewCtrl: ViewController,
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
    this.viewCtrl.dismiss({
      toggleFilters: this.toggleFilters
    });
  }

  cancelModal(): void {
    this.viewCtrl.dismiss();
  }
}

export interface ToggleFilters {
  poisonousIngredients: boolean;
  dangerousIngredients: boolean;
}
