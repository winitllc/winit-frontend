import { Component, NgZone, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeFormat, LensFacing, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { model } from 'wuzinit-common';
import ScanFactory from './scan.factory';
import { AppConfig } from '../app.config';
import { SpoonacularProduct } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { ProfileService } from '../profile/profile.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage implements OnInit {

  headerDisplayed: boolean = true;
  buttonDisplayed: boolean = true;
  activateScanner: boolean = false;

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private service: ProductService,
    private ngZone: NgZone,
    public factory: ScanFactory,
    private profileService: ProfileService,
    private alertController: AlertController
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log(`ScanPage.ngOnInit setting up scan page`);
      BarcodeScanner.isSupported().then((result) => {
        console.log(`ScanPage.ngOnInit: scanner is supported: ${JSON.stringify(result)}`);
      });
      BarcodeScanner.checkPermissions().then((result) => {
        console.log(`ScanPage.ngOnInit: scanner is permitted: ${JSON.stringify(result)}`);
      });
      BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener(
          'googleBarcodeScannerModuleInstallProgress',
          (event) => {
            this.ngZone.run(() => {
              console.log('googleBarcodeScannerModuleInstallProgress', event);
            });
          }
        );
      });
      // this.scan();
    } catch (error) {
      console.error(`ScanPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    // this.scan();
    this.buttonDisplayed = true;
    this.headerDisplayed = true;
  }

  public async scan(): Promise<void> {
    this.buttonDisplayed = false;
    this.headerDisplayed = false;
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
    }
    else {
      try {
        const listener = await BarcodeScanner.addListener(
          'barcodeScanned',
          async (event) => {
            console.log(`ScanPage.scan: barcode result: ${JSON.stringify(event)}`);
            // this.ngZone.run(() => {
            //   console.log(`ScanPage.scan: in ngZone`);
              listener.remove();
              console.log(`ScanPage.scan: listener removed`);
              this.activateScanner = false;
              console.log(`ScanPage.scan: activateScanner = false`);
              const barcode: string = event.barcode.rawValue;
              console.log(`ScanPage.scan: padded barcode: ${JSON.stringify(barcode)}`);
              this.getByBarcode(barcode);
            // });
          },
        );
        console.log(`ScanPage.scan: listener set up`);
        this.activateScanner = true;
        await BarcodeScanner.startScan({
          formats: [BarcodeFormat.UpcA],
          lensFacing: LensFacing.Back
        });
      } catch (error) {
        console.error(`ScanPage.scan: Error scanning the product: ${JSON.stringify(error)}`);
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async getByBarcode(barcode: string): Promise<void> {
    try {
      console.log(`ScanPage.getByBarcode: barcode to search: ${JSON.stringify(barcode)}`);
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
        // this.pushToProductPage({
        //   message: AppConfig.controlMessages.noProduct,
        //   barcode
        // });
        const wuzinitResult: model.WuzinitProduct = await this.service.getWuzinitProductByBarcode(barcode) as model.WuzinitProduct;
        console.log(`ScanPage.getByBarcode: result from wuzinit: ${JSON.stringify(wuzinitResult)}`);
        if (Boolean(wuzinitResult) && wuzinitResult.hasOwnProperty('code') && wuzinitResult.code.length > 0 && wuzinitResult.code != '-1') {
          this.pushToProductPage(wuzinitResult);
        } else {
          this.pushToProductPage({
            message: AppConfig.controlMessages.noProduct,
            barcode
          });
        }
      }
    } catch (error) {
      console.error(`ScanPage.getByBarcode: Error retrieving data by barcode ${barcode}:\n${JSON.stringify(error)}`);
      this.navigateBackward();
    }
  }

  private pushToProductPage(product: model.WuzinitProductBase | { message: string, barcode: string }): void {
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
