import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { model } from 'wuzinit-common';
import ScanFactory from './scan.factory';
import { AppConfig } from '../app.config';
import { SpoonacularProduct } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { ProfileService } from '../profile/profile.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private service: ProductService,
    public factory: ScanFactory,
    private profileService: ProfileService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // this.scan();
    } catch (error) {
      console.error(`ScanPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    this.scan();
  }

  public async scan(): Promise<void> {
    try {
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          console.log(result.barcode);
          const barcodeData: any = result.barcode;
          if (barcodeData.hasOwnProperty('cancelled') && !barcodeData.cancelled) {
            const barcode: string = this.factory.padCode(barcodeData);
            return this.getByBarcode(barcode);
          } else {
            this.navigateBackward();
          }
        },
      );
      await BarcodeScanner.startScan();
    } catch (error) {
      console.error(`ScanPage.scan: Error scanning the product: ${JSON.stringify(error)}`);
    }
  }

  private async getByBarcode(barcode: string): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        // cssClass: 'my-custom-class',
        message: `Loading product with barcode: ${barcode}`,
        // duration: 2000
      });
      await loading.present();
      const spoonacularResult: SpoonacularProduct = await this.service.getSpoonacularProductByBarcode(barcode) || JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
      console.log(`ScanPage.getByBarcode: result from spoonacular: ${JSON.stringify(spoonacularResult)}`);
      if (spoonacularResult.id > 0) {
        this.pushToProductPage(spoonacularResult);
        await loading.dismiss();
      } else {
        console.log(`ScanPage.getByBarcode: get from our db instead`);
        // const wuzinitResult: model.WuzinitProduct = await this.service.getWuzinitProductByBarcode(barcode);
        // console.log(`ScanPage.getByBarcode: result from wuzinit: ${JSON.stringify(wuzinitResult)}`);
        // if (Boolean(wuzinitResult) && wuzinitResult.hasOwnProperty('code') && wuzinitResult.code.length > 0 && wuzinitResult.code != '-1') {
        //   this.pushToProductPage(wuzinitResult);
        // } else {
        //   this.pushToProductPage({
        //     message: AppConfig.controlMessages.noProduct,
        //     barcode
        //   });
        // }
      }
    } catch (error) {
      console.error(`ScanPage.getByBarcode: Error retrieving data by barcode ${barcode}:\n${JSON.stringify(error)}`);
      this.navigateBackward();
    }
  }

  private pushToProductPage(product: model.WuzinitProductBase | {message: string, barcode: string}): void {
    try {
      // this.profileService.addToProfilePoints(AppConfig.pointAwards.scan);
      console.log(`ScanPage.pushToProductPage: pushing the product to product page: ${JSON.stringify(product)}`);
      const navExtras: NavigationExtras = {
        state: {
          product
        }
      };
      this.navCtrl.navigateForward('product', navExtras);
    } catch (error) {
      console.error(`ScanPage.pushToProductPage: Error pushing to the product page: ${JSON.stringify(error)}`);
    }
  }

  private navigateBackward(): void {
    this.navCtrl.back();
  }
}
