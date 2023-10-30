import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

import { SpoonacularSearchResult } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { AuthService } from '../util/auth.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss']
})
export class BrowsePage implements OnInit {

  public categories: any[] = AppConfig.categories.mainCategories;
  public searchBox: string = '';

  constructor(
    // private platform: Platform,
    // public navCtrl: NavController,
    // public modalController: ModalController,
    // private androidPermissions: AndroidPermissions,
    private auth: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private service: ProductService,
    private profileService: ProfileService
  ) {
    this.resetSearchbox();
  }

  async ngOnInit(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: `Loading...`
      });
      await loading.present();
      await this.auth.setup();
      // let profile = {
      //   id: '123',
      //   primaryUserEmail: 'test@123.com',
      //   users: [
      //     {
      //       id: '123',
      //       username: 'test',
      //       email: 'test@123.com',
      //       name: 'Test Name',
      //       allergies: [],
      //       medicalConditions: [],
      //       symptoms: []
      //     }
      //   ],
      //   points: {
      //     profileId: '123',
      //     pointsBalance: 0,
      //     pointsPending: 0,
      //     pointsAllTime: 0,
      //     pointsUsedAllTime: 0,
      //     scansAllTime: 0,
      //     searchesAllTime: 0,
      //     sectionsAddedAllTime: 0,
      //     sectionsPending: 0,
      //     productsPending: 0,
      //     productsAddedAllTime: 0
      //   },
      //   inAppPurchasesMade: [],
      //   premiumFeaturesPurchasesMade: [],
      //   lifestyleDiets: []
      // };
      let profile = await this.profileService.getProfile();
      await loading.dismiss();
      if (profile) {
        console.log(`BrowsePage.ngOnInit: already have a cached profile: ${JSON.stringify(profile)}`);
        // this.navCtrl.pop();
      } else {
        console.log(`BrowsePage.ngOnInit: calling signup page`);
        // await this.navCtrl.push(SignupPage);
        console.log(`BrowsePage.ngOnInit: signup page complete`);
      }
      // await this.checkAndroidPermissions();
      // await this.auth.setup();
      // await this.auth.fetchSpoonacularAPIKey();
    } catch (error) {
      console.error(`BrowsePage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async searchCategory(categorySearchString: string, categoryDisplayName: string): Promise<void> {
    const loading = await this.loadingController.create({
      // cssClass: 'my-custom-class',
      message: `Searching for: ${categoryDisplayName}`,
      // duration: 2000
    });
    await loading.present();
    const productSearchResponse: SpoonacularSearchResult = await this.service.searchProductByText(categorySearchString);
    console.log(`BrowsePage.searchCategory: result from spoonacular: ${JSON.stringify(productSearchResponse)}`);
    this.pushToResultsPage(productSearchResponse, categorySearchString);
    console.log(`BrowsePage.searchCategory called with categorySearchString: ${categorySearchString}, categoryDisplayName: ${categoryDisplayName}`);
    await loading.dismiss();
  }

  async searchByText(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        // cssClass: 'my-custom-class',
        message: `Searching for: ${this.searchBox}`,
        // duration: 2000
      });
      await loading.present();
      console.log(`BrowsePage.searchByText: search box contents: ${this.searchBox}`);
      const productSearchResponse: SpoonacularSearchResult = await this.service.searchProductByText(this.searchBox) || JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
      console.log(`BrowsePage.searchByText: result from spoonacular: ${JSON.stringify(productSearchResponse)}`);
      this.pushToResultsPage(productSearchResponse, this.searchBox);
      await loading.dismiss();
    } catch (error) {
      console.error(`BrowsePage.searchByText: Error searching by text: ${JSON.stringify(error)}`);
    }
  }

  // private async checkAndroidPermissions(): Promise<void> {
  //   const SEND_SMS = this.androidPermissions.PERMISSION.SEND_SMS;
  //   const BLUETOOTH = this.androidPermissions.PERMISSION.BLUETOOTH;
  //   const NFC = this.androidPermissions.PERMISSION.NFC;
  //   try {
  //     console.info(`BrowsePage.checkAndroidPermissions: requesting permissions for ${SEND_SMS}, ${BLUETOOTH}, ${NFC}`);
  //     await this.androidPermissions.requestPermissions([SEND_SMS, BLUETOOTH, NFC]);
  //   } catch (error) {
  //     console.error(`BrowsePage.checkAndroidPermissions: error requesting permissions: ${JSON.stringify(error)}`);
  //   }
  // }

  private pushToResultsPage(productSearchResponse: SpoonacularSearchResult, searchedText: string): void {
    try {
      // this.profileService.addToProfilePoints(AppConfig.pointAwards.search);
      this.resetSearchbox();
      const navExtras: NavigationExtras = {
        state: {
          productSearchResponse,
          searchedText
        }
      };
      // console.log(`BrowsePage.pushToResultsPage: pushing the following data to results page: ${JSON.stringify(navExtras)}`);
      this.navCtrl.navigateForward('results', navExtras);
    } catch (error) {
      console.error(`BrowsePage.pushToResultsPage: Error pushing to the results page: ${JSON.stringify(error)}`);
    }
  }

  private resetSearchbox(): void {
    this.searchBox = '';
  }
}
