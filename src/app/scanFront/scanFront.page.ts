import { Component, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions, ModalController, NavController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { ScanFrontCropperModalPage } from './scanFront-cropperModal.page';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileState } from '../profile/profile.state';
import { ProfileService } from '../profile/profile.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-scanFront',
  templateUrl: 'scanFront.page.html',
  styleUrls: ['scanFront.page.scss']
})
export class ScanFrontPage implements OnInit {

  imageCaptured: boolean = false;
  imageSrc: string = '';
  loading: HTMLIonLoadingElement | null = null;
  profile: any;
  noProductBarcode: string = '';
  nameText: string = '';
  nameS3ImageKey:string = '';
  frontS3ImageKey: string = '';

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
      console.log(`ScanFrontPage.ngOnInit setting up scan page`);
      this.imageCaptured = false;
      const currNavigation = this.router.getCurrentNavigation();
      const routerState = JSON.parse(JSON.stringify(currNavigation?.extras.state));
      this.noProductBarcode = routerState['noProductBarcode'];
      this.nameText = routerState['nameText'];
      this.nameS3ImageKey = routerState['nameS3ImageKey'];
      console.log(`ScanFrontPage.ngOnInit: noProductBarcode ${this.noProductBarcode}`);
      console.log(`ScanFrontPage.ngOnInit: nameText ${this.nameText}`);
      console.log(`ScanFrontPage.ngOnInit: nameS3ImageKey ${this.nameS3ImageKey}`);
    } catch (error) {
      console.error(`ScanFrontPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    console.log(`ScanFrontPage.ionViewWillEnter - beginning of ionViewWillEnter`);
    this.profile = this.profileState.getHealthProfile();
    console.log(`ScanFrontPage.ngOnInit: profile from state: ${JSON.stringify(this.profile)}`);
    this.imageCaptured = false;
    this.imageSrc = "";
  }

  async scanFront() {
    try {
      const imageData = await this.imageService.captureImageDataURL();
      this.presentLoading('Loading Image Cropper');
      const croppedImageData = await this.openCropperModal(imageData);
      this.imageCaptured = true;
      this.imageSrc = croppedImageData;
      const imageKeyInS3 = await this.imageService.callUploadToS3(croppedImageData);
      this.frontS3ImageKey = imageKeyInS3;
      console.log(`ScanFrontPage.scan: uploadToS3 key: ${JSON.stringify(imageKeyInS3)}`);
    } catch (error) {
      console.error(`ScanFrontPage.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
    }
  }

  resetSection() {
    this.imageCaptured = false;
    this.imageSrc = "";
    this.frontS3ImageKey = '';
  }

  continue() {
    console.log(`ScanBackPage.continue: calling continue with the frontS3ImageKey ${this.frontS3ImageKey}`);
    const navExtras: NavigationExtras = {
      state: {
        noProductBarcode: this.noProductBarcode,
        nameText: this.nameText,
        nameS3ImageKey: this.nameS3ImageKey,
        frontS3ImageKey: this.frontS3ImageKey,
        frontImage: this.imageSrc
      }
    };
    this.navCtrl.navigateForward('tabs/product/scanBack', navExtras);
  }

  async openCropperModal(imageData: string): Promise<string> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ScanFrontCropperModalPage,
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
