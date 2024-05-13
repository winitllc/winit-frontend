import { Component, Input, OnInit } from '@angular/core';
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
    this.imageSrc = imageToTextData.image;
    this.ingredientsText = imageToTextData.text;
    console.log(`AddProductModalPage.checkIngredients: imageToTextData: ${JSON.stringify(imageToTextData)}`);
  }

  resetSection() {
    this.ingredientsText = "";
    this.imageSrc = "";
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
      const imageData = await this.imageService.captureImageDataURL();
      const rawImageData = imageData.replace('data:image/jpeg;base64,', '');
      const imageKeyInS3 = await this.imageService.callUploadToS3(rawImageData);
      const imageText = await this.imageService.imageToText(imageKeyInS3);
      console.log(`AddProductModalComponent.imageToText: text from service: ${imageText}.`);
      return {
        text: imageText,
        image: imageData || ''
      };
    } catch (error) {
      console.error(`AddProductModalComponent.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }
}

interface ImageToTextData {
  image: string;
  text: string;
}
