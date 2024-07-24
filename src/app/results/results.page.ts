import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { AppConfig } from '../app.config';
import { model } from 'wuzinit-common';
import { ProfileState } from '../profile/profile.state';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenFoodFactsIngredient, OpenFoodFactsProduct } from '../product/product.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  private profile: any;
  public warnings: string[] = [];
  public noResults: boolean = false;
  public productResults: OpenFoodFactsProduct[] = [];

  constructor(
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private platform: Platform,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private profileState: ProfileState
  ) { }

  async ngOnInit() {
    console.log(`ResultsPage.ngOnInit: beginning of ngOnInit`);
  }

  async ngAfterContentChecked(): Promise<void> {
    try {
      console.log(`ScanPage.ionViewWillEnter - beginning of ionViewWillEnter`);
      this.profile = this.profileState.getHealthProfile();
      console.log(`ScanPage.ionViewWillEnter: profile from state: ${JSON.stringify(this.profile)}`);
      this.warnings = this.profile.medical.allergies.map((allergy: any) => {return allergy.name as string;});
      this.noResults = true;
      console.log(`ResultsPage.ionViewWillEnter: beginning of ionViewWillEnter`);
      let currNavigation = this.router.getCurrentNavigation();
      if (!currNavigation) {
        console.log(`ResultsPage.ionViewWillEnter: no currNavigation found, using last successful`);
        currNavigation = this.router.lastSuccessfulNavigation;
      }
      console.log(`ResultsPage.ionViewWillEnter: curr navigation properties: ${Object.keys(currNavigation || {})}`);
      if (currNavigation) {
        this.noResults = false;
        const routerState = JSON.parse(JSON.stringify(currNavigation.extras.state));
        console.log(`ResultsPage.ionViewWillEnter: routerState: ${JSON.stringify(routerState)}`);
        const products = routerState['products'];
        console.log(`ResultsPage.ionViewWillEnter: products from navParams: ${JSON.stringify(products)}`);
        let code_list: string[] = [];
        let id_list: string[] = [];
        products.forEach((product: OpenFoodFactsProduct) => {
          code_list.push(product.code);
          id_list.push(product.id);
        });
        console.log(`ResultsPage.ionViewWillEnter: code_list list from navParams: ${JSON.stringify(code_list)}`);
        console.log(`ResultsPage.ionViewWillEnter: id_list list from navParams: ${JSON.stringify(id_list)}`);
        this.productResults = products;
      } else {
        console.log(`ResultsPage.ionViewWillEnter: still no currNavigation: ${JSON.stringify(currNavigation)}`);
      }
    } catch (error) {
      console.error(`ResultsPage.ionViewWillEnter Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  selectProduct(id: string): void {
    console.log(`ResultsPage.selectProduct: id ${id}`);
    try {
      const product: OpenFoodFactsProduct | undefined = this.productResults.find((product: OpenFoodFactsProduct) => {
        return product.id == id;
      });
      console.log(`ResultsPage.selectProduct: pushing the selected product to product page: ${JSON.stringify(product)}`);
      if (product) {
        const navExtras: NavigationExtras = {
          state: {
            product
          }
        };
        console.log(`ResultsPage.selectProduct: nav extras for results page: ${JSON.stringify(navExtras)}`);
        this.navCtrl.navigateForward('tabs/product', navExtras);
      } else {
        console.log(`ResultsPage.selectProduct: no product: ${JSON.stringify(id)}`);
      }
    } catch (error) {
      console.error(`ResultsPage.selectProduct: Error pushing to the results page: ${JSON.stringify(error)}`);
    }
  }

}
