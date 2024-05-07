import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { ModalController } from '@ionic/angular';
import ImageService from '../util/image.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: 'addProductModal.page.html',
})
export class AddProductModalPage implements OnInit {
  @Input() barcode: string = "";
  ingredientsText: string = "";
  imageSrc: string = "";

  constructor(
    private modalCtrl: ModalController,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    console.log(`AddProductModalPage.constructor: barcode: ${this.barcode}`);
  }

  async checkIngredients() {
    console.log(`AddProductModalPage.checkIngredients: ingredientsText: ${this.ingredientsText}`);
    const imageToTextData = await this.imageToText();
    console.log(`AddProductModalPage.checkIngredients: imageToTextData: ${JSON.stringify(imageToTextData)}`);
  }

  resetSection() {
    this.ingredientsText = "";
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.barcode, 'confirm');
  }

  async imageToText(): Promise<ImageToTextData> {
    console.log(`AddProductModalComponent.imageToText: image to text selected`);
    try {
      console.log(`AddProductModalComponent.imageToText: running imageToText function`);
      // const imageData = await this.captureImagePhoto();
      const imageData = await this.captureImageBase64();
      console.log(`AddProductModalComponent.imageToText: imageData data: ${JSON.stringify(imageData)}.`);
      // console.log(`AddProductModalComponent.imageToText: length of imageData data: ${imageData.webPath?.length}.`);
      // console.log(`AddProductModalComponent.imageToText: reversed imageData data: ${imageData.webPath?.split('').reverse().join('')}.`);
      // const imageText = await this.imageService.imageToText(imageData.path || '');
      const imageText = await this.imageService.imageToText(imageData || '');
      console.log(`AddProductModalComponent.imageToText: text from service: ${imageText}.`);
      // this.imageSrc = imageData.webPath || '';
      this.imageSrc = imageData || '';
      return {
        // text: 'TBD',
        text: imageText,
        // image: imageData.webPath || ''
        image: imageData || ''
      };
    } catch (error) {
      console.error(`AddProductModalComponent.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }

  async captureImagePhoto(): Promise<Photo> {
    console.log(`AddProductModalPage.captureImagePhoto: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 2,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      console.log(`AddProductModalComponent.captureImagePhoto: imageData: ${JSON.stringify(imageData)}`);
      return imageData || {
        "webPath":"",
        "exif":{},
        "format":"",
        "saved":false,
        "path":""
      };
    } catch (error) {
      console.error(`AddProductModalPage.captureImagePhoto: error from camera: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async captureImageBase64(): Promise<string> {
    console.log(`AddProductModalPage.captureImageBase64: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 2,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      console.log(`AddProductModalComponent.captureImageBase64: imageData: ${JSON.stringify(imageData)}`);
      return imageData.base64String || '';
    } catch (error) {
      console.error(`AddProductModalPage.captureImageBase64: error from camera: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}

interface ImageToTextData {
  image: string;
  text: string;
}
