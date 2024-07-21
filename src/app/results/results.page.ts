import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { AppConfig } from '../app.config';
import { model } from 'wuzinit-common';
import { ProfileState } from '../profile/profile.state';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenFoodFactsProduct } from '../product/product.service';

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

  async ionViewWillEnter(): Promise<void> {
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
        const routerState = JSON.parse(JSON.stringify(currNavigation.extras.state));
        console.log(`ResultsPage.ionViewWillEnter: routerState: ${JSON.stringify(routerState)}`);
        const products = routerState['products'];
        console.log(`ResultsPage.ionViewWillEnter: products from navParams: ${JSON.stringify(products)}`);
        this.productResults = products;
      } else {
        console.log(`ResultsPage.ionViewWillEnter: still no currNavigation: ${JSON.stringify(currNavigation)}`);
      }
    } catch (error) {
      console.error(`ResultsPage.ionViewWillEnter Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

}
