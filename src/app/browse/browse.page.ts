import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

import { NavController, LoadingController, LoadingOptions, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { AuthService } from '../util/auth.service';
import { ProfileService } from '../profile/profile.service';
import { OpenFoodFactsProduct, ProductService } from '../product/product.service';
import { SearchProductModalComponent } from './search-productModal.page';
import { FilterProductModalComponent } from './filter-productModal.page';
import { CacheService } from '../util/cache.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss']
})
export class BrowsePage implements OnInit {

  loading: HTMLIonLoadingElement | null = null;
  public categories: any[] = AppConfig.categories.mainCategories;
  public searchBox: string = '';
  public labelFilters: string[] = [];

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private productService: ProductService,
    private cacheService: CacheService
  ) {
    // this.resetSearchbox();
  }

  async ngOnInit(): Promise<void> {
    try {

    } catch (error) {
      console.error(`BrowsePage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async ionViewWillEnter(): Promise<void> {
    try {
      const labelFilters = ((await this.cacheService.getItem('labelFilters')) || []) as string[];
      this.labelFilters = labelFilters;
      console.log(`BrowsePage.ionViewWillEnter: labelFilters ${JSON.stringify(labelFilters)}`);
    } catch (error) {
      console.error(`BrowsePage.ionViewWillEnter Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
  
  async browseProducts(category: string) {
    console.log(`BrowsePage.browseProducts: category to search: ${category}`);
    try {
      const withLabelsMessage: string = this.labelFilters.length > 0 ? ` with labels: ${this.labelFilters.join(', ')}` : '';
      const loadingMessage: string = `searching for ${category}${withLabelsMessage}`;
      await this.presentLoading(loadingMessage, 10000);
      const productSearchResults: any = await this.productService.searchProductAPI(category, this.labelFilters);
      console.log(`BrowsePage.browseProducts: results from the category search: ${JSON.stringify(productSearchResults)}`);
      await this.dismissLoading();
      this.pushToResultsPage(productSearchResults, category);
    } catch (error) {
      console.error(`BrowsePage.browseProducts Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async searchProductModal() {

    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: SearchProductModalComponent,
      showBackdrop: false
    });
    console.log(`BrowsePage.searchProductModal: modal set up`);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`BrowsePage.searchProductModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`BrowsePage.searchProductModal: modal dismissed, role: ${JSON.stringify(role)}`);
    if (role == 'cancel' || role != 'confirm') {
      return;
    }
    if (data) {
      console.log(`BrowsePage.searchProductModal: search item: ${JSON.stringify(data)}`);
      this.browseProducts(data);
    }
  }

  async filterProductModal() {

    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: FilterProductModalComponent,
      showBackdrop: false,
      componentProps: {
        labelFilters: this.labelFilters
      }
    });
    console.log(`BrowsePage.filterProductModal: modal set up`);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`BrowsePage.filterProductModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`BrowsePage.filterProductModal: modal dismissed, role: ${JSON.stringify(role)}`);
    if (role == 'cancel' || role != 'confirm') {
      return;
    }
    if (data) {
      console.log(`BrowsePage.filterProductModal: labels to filter: ${JSON.stringify(data)}`);
      this.labelFilters = data;
      await this.cacheService.putItem('labelFilters', data);
    }
  }

  private pushToResultsPage(productSearchResults: any, category: string): void {
    try {
      // this.profileService.addToProfilePoints(AppConfig.pointAwards.scan);
      console.log(`BrowsePage.pushToResultsPage: pushing the product results to results page: ${JSON.stringify(productSearchResults)}`);
      const navExtras: NavigationExtras = {
        state: {
          productSearchResults,
          category: category,
          labelFilters: this.labelFilters
        }
      };
      console.log(`BrowsePage.pushToResultsPage: nav extras for results page: ${JSON.stringify(navExtras)}`);
      this.navCtrl.navigateForward('tabs/results', navExtras);
    } catch (error) {
      console.error(`BrowsePage.pushToResultsPage: Error pushing to the results page: ${JSON.stringify(error)}`);
    }
  }

  async presentLoading(loadingMessage: string, duration?: number) {
    this.dismissLoading();
    const loadingOpts: LoadingOptions = {
      message: loadingMessage,
      showBackdrop: true,
      spinner: 'circular',
      duration: duration || 2000,
      cssClass: 'loading-modal'
    };
    this.loading = await this.loadingCtrl.create(loadingOpts);

    this.loading.present();
  }

  async dismissLoading() {
    await this.loading?.dismiss();
  }
}
