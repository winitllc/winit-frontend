import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { ModalController } from '@ionic/angular';
// import ImageService from '../util/image.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: 'addProductModal.page.html',
})
export class AddProductModalPage implements OnInit {
  @Input() barcode: string = "";
  ingredientsText: string = "";

  constructor(
    private modalCtrl: ModalController,
    // private imageService: ImageService
  ) {}

  ngOnInit() {
    console.log(`AddProductModalPage.constructor: barcode: ${this.barcode}`);
  }

  async checkIngredients() {
    console.log(`AddProductModalPage.checkIngredients: ingredientsText: ${this.ingredientsText}`);
    const imageToTextData = await this.imageToText();
    console.log(`AddProductModalPage.checkIngredients: imageToTextData: ${imageToTextData}`);
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
      const imageData: string = await this.captureImage();
      console.log(`AddProductModalComponent.imageToText: cropped imageData data: ${imageData}.`);
      return {
        text: 'TBD',
        // text: await this.imageService.imageToText(imageData),
        image: imageData
      };
    } catch (error) {
      console.error(`AddProductModalComponent.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }

  async captureImage() {
    console.log(`AddProductModalPage.captureImage: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });
      console.log(`AddProductModalComponent.captureImage: imageData: ${JSON.stringify(imageData)}`);
      return imageData.dataUrl || "";
    } catch (error) {
      console.error(`AddProductModalPage.captureImage: error from camera: ${JSON.stringify(error)}`);
      return "";
    }
  }
}

interface ImageToTextData {
  image: string;
  text: string;
}
