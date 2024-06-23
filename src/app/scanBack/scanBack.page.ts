import { Component, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions, ModalController, NavController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { ScanBackCropperModalPage } from './scanBack-cropperModal.page';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileState } from '../profile/profile.state';
import { ProfileService } from '../profile/profile.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-scanBack',
  templateUrl: 'scanBack.page.html',
  styleUrls: ['scanBack.page.scss']
})
export class ScanBackPage implements OnInit {

  imageCaptured: boolean = false;
  imageSrc: string = '';
  loading: HTMLIonLoadingElement | null = null;
  profile: any;
  barcode: string = '';
  nameText: string = '';
  nameS3ImageKey:string = '';
  frontS3ImageKey: string = '';
  frontImage: string = '';
  backS3ImageKey: string = '';

  constructor(
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private profileState: ProfileState,
    private profileService: ProfileService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log(`ScanBackPage.ngOnInit setting up scan page`);
      this.imageCaptured = false;
      let currNavigation = this.router.getCurrentNavigation();
      if (!currNavigation) {
        currNavigation = this.router.lastSuccessfulNavigation;
      }
      console.log(`ScanBackPage.ngOnInit: currNavigation.extras.state ${JSON.stringify(currNavigation?.extras.state)}`);
      const routerState = JSON.parse(JSON.stringify(currNavigation?.extras.state));
      this.barcode = routerState['barcode'];
      this.nameText = routerState['nameText'];
      this.nameS3ImageKey = routerState['nameS3ImageKey'];
      this.frontS3ImageKey = routerState['frontS3ImageKey'];
      this.frontImage = routerState['frontImage'];
      console.log(`ScanBackPage.ngOnInit: barcode ${JSON.stringify(this.barcode)}`);
      console.log(`ScanBackPage.ngOnInit: nameText ${this.nameText}`);
      console.log(`ScanBackPage.ngOnInit: nameS3ImageKey ${this.nameS3ImageKey}`);
      console.log(`ScanBackPage.ngOnInit: frontS3ImageKey ${this.frontS3ImageKey}`);
      console.log(`ScanBackPage.ngOnInit: frontImage ${this.frontImage}`);
    } catch (error) {
      console.error(`ScanBackPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    console.log(`ScanBackPage.ionViewWillEnter - beginning of ionViewWillEnter`);
    this.profile = this.profileState.getHealthProfile();
    console.log(`ScanBackPage.ngOnInit: profile from state: ${JSON.stringify(this.profile)}`);
    this.imageCaptured = false;
    this.imageSrc = "";
  }

  async scanBack() {
    try {
      const imageData = await this.imageService.captureImageDataURL();
      this.presentLoading('Loading Image Cropper');
      const croppedImageData = await this.openCropperModal(imageData);
      this.imageCaptured = true;
      this.imageSrc = croppedImageData;
      const imageKeyInS3 = await this.imageService.callUploadToS3(croppedImageData, `back-${this.barcode}`);
      this.backS3ImageKey = imageKeyInS3;
      console.log(`ScanBackPage.scanBack: uploadToS3 key: ${JSON.stringify(imageKeyInS3)}`);
    } catch (error) {
      console.error(`ScanBackPage.scanBack: error capturing image and converting to text: ${JSON.stringify(error)}`);
    }
  }

  resetSection() {
    this.imageCaptured = false;
    this.imageSrc = "";
    this.backS3ImageKey = '';
  }

  continue() {
    console.log(`ScanBackPage.continue: calling continue with the backS3ImageKey ${this.backS3ImageKey}`);
    const navExtras: NavigationExtras = {
      state: {
        barcode: this.barcode,
        nameText: this.nameText,
        nameS3ImageKey: this.nameS3ImageKey,
        frontS3ImageKey: this.frontS3ImageKey,
        frontImage: this.frontImage,
        backS3ImageKey: this.backS3ImageKey
      }
    };
    console.log(`ScanBackPage.continue: navExtras  ${JSON.stringify(navExtras)}`);
    this.navCtrl.navigateForward('tabs/product/scanIngredients', navExtras);
  }

  async openCropperModal(imageData: string): Promise<string> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ScanBackCropperModalPage,
      componentProps: {
        imageInput: imageData
      }
    });
    await this.dismissLoading();
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`ScanBackPage.openCropperModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`ScanBackPage.openCropperModal: modal dismissed, role: ${JSON.stringify(role)}`);
    return data as string;
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

interface ImageToTextData {
  image: string;
  text: string;
  s3ImageKey: string;
}
