import { Component, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions, ModalController, NavController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { ScanIngredientsCropperModalPage } from './scanIngredients-cropperModal.page';
import { ProfileState } from '../profile/profile.state';
import { ProfileService } from '../profile/profile.service';
import { ProductService } from '../product/product.service';
import { NavigationExtras, Router } from '@angular/router';
import { model } from 'wuzinit-common';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-scanIngredients',
  templateUrl: 'scanIngredients.page.html',
  styleUrls: ['scanIngredients.page.scss']
})
export class ScanIngredientsPage implements OnInit {

  imageCaptured: boolean = false;
  ingredientsText: any = '';
  imageSrc: string = '';
  loading: HTMLIonLoadingElement | null = null;
  profile: any;
  noProductBarcode: string = '';
  nameText: string = '';
  nameS3ImageKey:string = '';
  frontS3ImageKey: string = '';
  frontImage: string = '';
  backS3ImageKey: string = '';
  ingredientsS3ImageKey: string = '';

  constructor(
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private navCtrl: NavController,
    private profileState: ProfileState,
    private profileService: ProfileService,
    private productService: ProductService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log(`ScanIngredientsPage.ngOnInit setting up scan page`);
      this.imageCaptured = false;
      const currNavigation = this.router.getCurrentNavigation();
      const routerState = JSON.parse(JSON.stringify(currNavigation?.extras.state));
      this.noProductBarcode = routerState['noProductBarcode'];
      this.nameText = routerState['nameText'];
      this.nameS3ImageKey = routerState['nameS3ImageKey'];
      this.frontS3ImageKey = routerState['frontS3ImageKey'];
      this.frontImage = routerState['frontImage'];
      this.backS3ImageKey = routerState['backS3ImageKey'];
      console.log(`ScanBackPage.ngOnInit: noProductBarcode ${this.noProductBarcode}`);
      console.log(`ScanBackPage.ngOnInit: nameText ${this.nameText}`);
      console.log(`ScanBackPage.ngOnInit: nameS3ImageKey ${this.nameS3ImageKey}`);
      console.log(`ScanBackPage.ngOnInit: frontS3ImageKey ${this.frontS3ImageKey}`);
      console.log(`ScanBackPage.ngOnInit: frontImage ${this.frontImage}`);
      console.log(`ScanBackPage.ngOnInit: backS3ImageKey ${this.backS3ImageKey}`);
    } catch (error) {
      console.error(`ScanIngredientsPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    console.log(`ScanIngredientsPage.ionViewWillEnter - beginning of ionViewWillEnter`);
    this.profile = this.profileState.getHealthProfile();
    console.log(`ScanIngredientsPage.ngOnInit: profile from state: ${JSON.stringify(this.profile)}`);
    this.imageCaptured = false;
    this.ingredientsText = "";
    this.imageSrc = "";
  }

  async scanIngredients() {
    const imageToTextData = await this.imageToText();
    this.imageCaptured = true;
    this.imageSrc = imageToTextData.image;
    this.ingredientsText = imageToTextData.text;
    console.log(`ScanIngredientsPage.scan: imageToTextData: ${JSON.stringify(imageToTextData)}`);
    this.profileService.addToProfilePoints(1);
  }

  resetSection() {
    this.imageCaptured = false;
    this.ingredientsText = "";
    this.imageSrc = "";
  }

  async continue() {
    const product: model.WuzinitProduct = JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    product.code = this.noProductBarcode;
    product.productName = this.nameText;
    product.images.front = `https://wuzinit-product-images-bucket.s3.us-west-2.amazonaws.com/${this.frontS3ImageKey}`;
    product.ingredientsText = this.ingredientsText;
    this.presentLoading('Sending new product to product update service for review.');
    await this.productService.addNewProductUpdate(product);
    this.dismissLoading();
    product.images.front = this.frontImage;
    console.log(`ScanIngredientsPage.continue: product to push to product page: ${JSON.stringify(product)}`);
    const navExtras: NavigationExtras = {
      state: {
        product
      }
    };
    console.log(`ScanIngredientsPage.continue: navExtras: ${JSON.stringify(navExtras)}`);
    this.navCtrl.navigateForward('tabs/product', navExtras);
  }

  async imageToText(): Promise<ImageToTextData> {
    console.log(`ScanIngredientsPage.imageToText: image to text selected`);
    try {
      console.log(`ScanIngredientsPage.imageToText: running imageToText function`);
      const imageData = await this.imageService.captureImageDataURL();
      this.presentLoading('Loading Image Cropper');
      const croppedImageData = await this.openCropperModal(imageData);
      this.presentLoading('Getting Text From Image', 5000);
      const rawImageData = croppedImageData.replace('data:image/jpeg;base64,', '');
      const imageToTextData = await this.imageService.callImageToText(rawImageData);
      const imageKeyInS3 = imageToTextData.imageKey;
      const imageText = imageToTextData.imageText;
      this.dismissLoading();
      console.log(`ScanIngredientsPage.imageToText: text from service: ${imageText}.`);
      return {
        text: imageText,
        image: croppedImageData || '',
        s3ImageKey: imageKeyInS3
      };
    } catch (error) {
      console.error(`ScanIngredientsPage.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }

  async openCropperModal(imageData: string): Promise<string> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ScanIngredientsCropperModalPage,
      componentProps: {
        imageInput: imageData
      }
    });
    await this.dismissLoading();
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`ProductPage.openCropperModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`ProductPage.openCropperModal: modal dismissed, role: ${JSON.stringify(role)}`);
    return data as string;
  }

  // addAlertHighlights(ingredientsText: string): string {
  //   const ingredientsText: string = ingredientsText.split(/\.\s+|\.$/).map((sentence) => {
  //     console.log(`ProductPage.addAlertHighlights: sentence to check: ${sentence}`);
  //     return sentence.split(/,\s+/).map((phrase) => {
  //       console.log(`ProductPage.addAlertHighlights: phrase to check: ${phrase}`);
  //       return phrase.split(' ').map((word) => {
  //         console.log(`ProductPage.addAlertHighlights: word to check: ${word}`);
  //         return this.matchWarnings(word) ? `<span background="danger">${word}</span>` : word;
  //       }).join(' ');
  //     }).join(', ');
  //   }).join('. ');
  //   console.log(`ProductPage.addAlertHighlights: new text for ingredients with highlights: ${ingredientsText}`);
  //   return ingredientsText;
  // }

  // matchWarnings(phraseOrWord: string): boolean {
  //   const warnings = this.warnings;
  //   console.log(`ProductPage.matchWarnings: warnings: ${JSON.stringify(warnings)}`);
  //   return warnings.reduce((prevResult, currWarning) => {
  //     console.log(`ProductPage.matchWarnings: currWarning to check: ${currWarning}`);
  //     return prevResult || phraseOrWord.toLowerCase().includes(currWarning.toLowerCase());
  //   }, false);
  // }

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

interface ImageToTextData {
  image: string;
  text: string;
  s3ImageKey: string;
}
