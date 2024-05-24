import { Component, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions, ModalController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { ScanCropperModalPage } from './scan-cropperModal.page';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileState } from '../profile/profile.state';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage implements OnInit {

  imageCaptured: boolean = false;
  ingredientsTextHTML: any = '';
  imageSrc: string = '';
  loading: HTMLIonLoadingElement | null = null;
  profile: any;
  warnings: string[] = [];

  constructor(
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
    private profileState: ProfileState,
    private profileService: ProfileService
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
    this.profile = this.profileState.getHealthProfile();
    console.log(`ScanPage.ngOnInit: profile from state: ${JSON.stringify(this.profile)}`);
    this.warnings = this.profile.medical.allergies.map((allergy: any) => {return allergy.name as string;});
    this.imageCaptured = false;
    this.ingredientsTextHTML = "";
    this.imageSrc = "";
  }

  async scan() {
    const imageToTextData = await this.imageToText();
    this.imageCaptured = true;
    this.imageSrc = imageToTextData.image;
    this.ingredientsTextHTML = this.sanitizer.bypassSecurityTrustHtml(this.addAlertHighlights(imageToTextData.text));
    console.log(`ScanPage.scan: imageToTextData: ${JSON.stringify(imageToTextData)}`);
    this.profileService.addToProfilePoints(1);
  }

  resetSection() {
    this.imageCaptured = false;
    this.ingredientsTextHTML = "";
    this.imageSrc = "";
  }

  async imageToText(): Promise<ImageToTextData> {
    console.log(`ScanPage.imageToText: image to text selected`);
    try {
      console.log(`ScanPage.imageToText: running imageToText function`);
      const imageData = await this.imageService.captureImageDataURL();
      this.presentLoading('Loading Image Cropper');
      const croppedImageData = await this.openCropperModal(imageData);
      this.presentLoading('Getting Text From Image', 5000);
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
    await this.dismissLoading();
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`ProductPage.openCropperModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`ProductPage.openCropperModal: modal dismissed, role: ${JSON.stringify(role)}`);
    return data as string;
  }

  addAlertHighlights(ingredientsText: string): string {
    const ingredientsTextHTML: string = ingredientsText.split(/\.\s+|\.$/).map((sentence) => {
      console.log(`ProductPage.addAlertHighlights: sentence to check: ${sentence}`);
      return sentence.split(/,\s+/).map((phrase) => {
        console.log(`ProductPage.addAlertHighlights: phrase to check: ${phrase}`);
        return phrase.split(' ').map((word) => {
          console.log(`ProductPage.addAlertHighlights: word to check: ${word}`);
          return this.matchWarnings(word) ? `<span style="background-color: red">${word}</span>` : word;
        }).join(' ');
      }).join(', ');
    }).join('. ');
    console.log(`ProductPage.addAlertHighlights: new text for ingredients with highlights: ${ingredientsTextHTML}`);
    return ingredientsTextHTML;
  }

  matchWarnings(phraseOrWord: string): boolean {
    const warnings = this.warnings;
    console.log(`ProductPage.matchWarnings: warnings: ${JSON.stringify(warnings)}`);
    return warnings.reduce((prevResult, currWarning) => {
      console.log(`ProductPage.matchWarnings: currWarning to check: ${currWarning}`);
      return prevResult || phraseOrWord.toLowerCase().includes(currWarning.toLowerCase());
    }, false);
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
}
