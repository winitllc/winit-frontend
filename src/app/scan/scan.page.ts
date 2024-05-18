import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { ScanCropperModalPage } from './scan-cropperModal.page';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage implements OnInit {

  imageCaptured: boolean = false;
  ingredientsText: string = "";
  imageSrc: string = "";
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log(`ScanPage.ngOnInit setting up scan page`);
      this.imageCaptured = false;
    } catch (error) {
      console.error(`ScanPage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    console.log(`ScanPage.ionViewWillEnter - beginning of ionViewWillEnter`);
    this.imageCaptured = false;
    this.ingredientsText = "";
    this.imageSrc = "";
  }

  async scan() {
    console.log(`ScanPage.scan: ingredientsText: ${this.ingredientsText}`);
    const imageToTextData = await this.imageToText();
    this.imageCaptured = true;
    this.imageSrc = imageToTextData.image;
    this.ingredientsText = imageToTextData.text;
    console.log(`ScanPage.scan: imageToTextData: ${JSON.stringify(imageToTextData)}`);
  }

  resetSection() {
    this.imageCaptured = false;
    this.ingredientsText = "";
    this.imageSrc = "";
  }

  async imageToText(): Promise<ImageToTextData> {
    console.log(`ScanPage.imageToText: image to text selected`);
    try {
      console.log(`ScanPage.imageToText: running imageToText function`);
      const imageData = await this.imageService.captureImageDataURL();
      this.presentLoading('Loading Image Cropper');
      const croppedImageData = await this.openCropperModal(imageData);
      this.presentLoading('Getting Text From Image');
      const rawImageData = croppedImageData.replace('data:image/jpeg;base64,', '');
      const imageKeyInS3 = await this.imageService.callUploadToS3(rawImageData);
      const imageText = await this.imageService.imageToText(imageKeyInS3);
      this.dismissLoading();
      console.log(`ScanPage.imageToText: text from service: ${imageText}.`);
      return {
        text: imageText,
        image: croppedImageData || ''
      };
    } catch (error) {
      console.error(`ScanPage.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }

  async openCropperModal(imageData: string): Promise<string> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ScanCropperModalPage,
      componentProps: {
        imageInput: imageData
      }
    });
    this.dismissLoading();
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`ProductPage.openCropperModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`ProductPage.openCropperModal: modal dismissed, role: ${JSON.stringify(role)}`);
    return data as string;
  }

  async presentLoading(loadingMessage: string) {
    if (this.loading) {
      this.dismissLoading();
    }
    this.loading = await this.loadingCtrl.create({
      message: loadingMessage
    });

    this.loading.present();
  }

  async dismissLoading() {
    this.loading?.dismiss();
  }
}

interface ImageToTextData {
  image: string;
  text: string;
}
