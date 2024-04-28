import { Component, NgZone } from "@angular/core";
import { AlertController, ModalController, NavController, NavParams } from "@ionic/angular";
import { model } from 'wuzinit-common';
import { AppConfig } from '../../app.config';
import { Camera, CameraResultType } from "@capacitor/camera";
import ImageService from "../../util/image.service";
import { ConfirmSectionModalComponent } from "../confirmSectionModal/confirmSectionModal";
import { CropImageModalComponent } from "../cropImageModal/cropImageModal";
import { ProductPage } from "../../product/product.page";
import { ProductService } from "../../product/product.service";
import { EnvironmentConfig } from "../../environment.config";
import { LoadingPage } from "../../loading/loading";
import { SpoonacularProduct } from "../../product/product.model";
import { ProfileService } from "../../profile/profile.service";

@Component({
  selector: 'wuzinit-add-product',
  templateUrl: 'addProductModal.html'
})
export class AddProductModalComponent {

  public product: model.WuzinitProduct;
  public currentSection: AddSectionModel;
  private currentSectionIndex: number;

  public feedback: AddProductFeedback = {
    confirmedSections: {
      productName: false,
      productImage: false,
      // productNutrition: false,
      productIngredients: false
    },
    confirmedSectionsLength: 0,
    pointsAwarded: 0
  };

  private sectionStates: AddSectionModel[] = [{
    sectionKey: 'productName',
    sectionLabel: 'Product Name',
    imageData: '',
    confirmed: false,
    skipped: false,
    loading: false,
    text: ''
  },{
    sectionKey: 'productImage',
    sectionLabel: 'Product Image',
    imageData: '',
    confirmed: false,
    skipped: false,
    loading: false
  },{
  //   sectionKey: 'productNutrition',
  //   sectionLabel: 'Nutrition Label',
  //   imageData: '',
  //   confirmed: false,
  //   skipped: false,
  //   loading: false,
  //   text: ''
  // },{
    sectionKey: 'productIngredients',
    sectionLabel: 'Ingredients Text',
    imageData: '',
    confirmed: false,
    skipped: false,
    loading: false,
    text: '',
    ingredientsSections: {
      ingredients: '',
      contains: '',
      traces: ''
    }
  }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private camera: Camera,
    private modalController: ModalController,
    private zone: NgZone,
    private imageService: ImageService,
    private productService: ProductService,
    private profileService: ProfileService
  ) {
    this.currentSectionIndex = 0;
    this.currentSection = Object.assign({}, this.sectionStates[this.currentSectionIndex]);
    this.product = AppConfig.emptyWuzinitProduct;
    this.product.code = navParams.get('barcode');
  }

  updateProduct(section: AddSectionModel): void {
    switch (section.sectionKey) {
      case 'productName':
        console.log(`AddProductModalComponent.updateProduct: setting product name: ${section.text}`);
        this.product.productName = section.text;
        break;
      case 'productImage':
        console.log(`AddProductModalComponent.updateProduct: setting product image: ${section.imageData}`);
        this.product.images.front = section.imageData;
        break;
      case 'productIngredients':
        console.log(`AddProductModalComponent.updateProduct: setting product ingredients: ${section.text}`);
        this.product.ingredientsText = section.ingredientsSections.ingredients;
        this.product.ingredientsList = section.ingredientsSections.ingredients.split(', ');
        this.product.tracesList = section.ingredientsSections.traces.split(', ');
        this.product.containsList = section.ingredientsSections.contains.split(', ');
        break;
      default:
        console.error(`AddProductModalComponent.updateProduct: not sure what section we are trying to update: ${JSON.stringify(section)}`);
    }
  }

  updateCurrentSection(section: AddSectionModel): void {
    this.zone.run(() => {
      console.log(`AddProductModalComponent.updateCurrentSection: updating the current section with ${JSON.stringify(section)}`);
      this.currentSection = Object.assign({}, section);
      console.log(`AddProductModalComponent.updateCurrentSection: section states: ${JSON.stringify(this.sectionStates)}`);
    });
  }

  private updateSectionState(index: number, section: AddSectionModel): void {
    this.zone.run(() => {
      this.sectionStates[index] = Object.assign({}, section);
    });
  }

  private confirmSection(): void {
    this.zone.run(() => {
      console.log(`AddProductModalComponent.confirmSection: confirming the section`);
      this.currentSection.skipped = false;
      console.log(`AddProductModalComponent.confirmSection: section skipped set to false`);
      this.currentSection.confirmed = true;
      console.log(`AddProductModalComponent.confirmSection: section confirmed set to true`);
      this.updateSectionState(this.currentSectionIndex, this.currentSection);
      console.log(`AddProductModalComponent.confirmSection: updating the product with the current section: ${JSON.stringify(this.currentSection)}`);
      this.updateProduct(this.currentSection);
      this.updateFeedbackSections(this.currentSection.sectionKey, false);
      console.log(`AddProductModalComponent.confirmSection: updating the section index`);
      const newSectionIndex = this.calculateNextSectionIndex();
      console.log(`AddProductModalComponent.confirmSection: current section index: ${this.currentSectionIndex}, new section index: ${newSectionIndex}`);
      const newSection = this.sectionStates[newSectionIndex];
      console.log(`AddProductModalComponent.confirmSection: new section: ${JSON.stringify(newSection)}`);
      this.updateCurrentSection(newSection);
      this.currentSectionIndex = newSectionIndex;
      console.log(`AddProductModalComponent.confirmSection: new current section: ${JSON.stringify(this.currentSection)}`);
      console.log(`AddProductModalComponent.confirmSection: product: ${JSON.stringify(this.product)}`);
    });
  }

  skipSection(): void {
    this.zone.run(() => {
      console.log(`AddProductModalComponent.skipSection: skipping the section`);
      console.log(`AddProductModalComponent.skipSection: updating the section index`);
      const newSectionIndex = this.calculateNextSectionIndex();
      console.log(`AddProductModalComponent.skipSection: current section index: ${this.currentSectionIndex}, new section index: ${newSectionIndex}`);
      const newSection = this.sectionStates[newSectionIndex];
      console.log(`AddProductModalComponent.skipSection: new section: ${JSON.stringify(newSection)}`);
      this.updateCurrentSection(newSection);
      this.currentSectionIndex = newSectionIndex;
      console.log(`AddProductModalComponent.skipSection: new current section: ${JSON.stringify(this.currentSection)}`);
      console.log(`AddProductModalComponent.skipSection: product: ${JSON.stringify(this.product)}`);
    });
  }

  previousSection(): void {
    this.zone.run(() => {
      console.log(`AddProductModalComponent.previousSection: going back a section`);
      console.log(`AddProductModalComponent.previousSection: updating the section index`);
      const newSectionIndex = this.calculatePreviousSectionIndex();
      console.log(`AddProductModalComponent.previousSection: current section index: ${this.currentSectionIndex}, new section index: ${newSectionIndex}`);
      const newSection = this.sectionStates[newSectionIndex];
      console.log(`AddProductModalComponent.previousSection: new section: ${JSON.stringify(newSection)}`);
      this.updateCurrentSection(newSection);
      this.currentSectionIndex = newSectionIndex;
      console.log(`AddProductModalComponent.previousSection: new current section: ${JSON.stringify(this.currentSection)}`);
      console.log(`AddProductModalComponent.previousSection: product: ${JSON.stringify(this.product)}`);
    });
  }

  selectSection(sectionIndex: number): void {
    this.zone.run(() => {
      this.updateCurrentSection(this.sectionStates[sectionIndex]);
      this.currentSectionIndex = sectionIndex;
    });
  }

  async confirmSubmitProduct(): Promise<void> {
    try {
      await this.presentConfirmProductModal();
      this.navCtrl.push(LoadingPage, {
        loadingMessage: `Saving ${this.product.productName}`
      });
      if (this.product.images.front && this.product.images.front.length > 0) {
        const newImageKey: string = `${Math.random() * 1000000}.${this.product.code}.jpg`;
        const newImageURL: string = `https://${EnvironmentConfig.s3.cloudfrontURL}/${newImageKey}`;
        console.log(`AddProductModalComponent.confirmSubmitProduct: new image url: ${newImageURL}`);
        await this.imageService.saveImage(this.product.images.front, newImageKey);
        this.product.images.front = newImageURL;
      }
      console.log(`AddProductModalComponent.confirmSubmitProduct: saving the product to the product update database`);
      await this.productService.addProductUpdate(this.product);
      console.log(`AddProductModalComponent.confirmSubmitProduct: product added to the product update database`);
      this.navCtrl.pop();
      this.submitProduct();
    } catch (error) {
      console.error(`AddProductModalComponent.confirmSubmitProduct: error confirming the product: ${JSON.stringify(error)}`);
    }
  }

  private submitProduct(): void {
    this.modalController.dismiss({
      product: this.product
    });
  }

  cancelModal(): void {
    this.modalController.dismiss();
  }

  async nameSection(): Promise<void> {
    try {
      this.currentSection.loading = true;
      const imageToText: ImageToTextData = await this.imageToText();
      const halfText: string = imageToText.text.substr(0, imageToText.text.length/2);
      await this.presentConfirmSectionModal(this.currentSection.sectionKey, imageToText.image, halfText);
      console.log(`AddProductModalComponent.nameSection: updating the name section`);
      this.setCurrentSectionData(imageToText.image, halfText);
      console.log(`AddProductModalComponent.nameSection: name section updated`);
      this.confirmSection();
    } catch (error) {
      console.error(`AddProductModalComponent.nameSection: error setting name: ${JSON.stringify(error)}`);
    }
  }

  async imageSection(): Promise<void> {
    try {
      this.currentSection.loading = true;
      const croppedImageData: string = await this.captureAndCropImage();
      await this.presentConfirmSectionModal(this.currentSection.sectionKey, croppedImageData);
      console.log(`AddProductModalComponent.imageSection: updating the image section`);
      this.setCurrentSectionData(croppedImageData);
      console.log(`AddProductModalComponent.imageSection: image section updated`);
      this.confirmSection();
    } catch (error) {
      console.error(`AddProductModalComponent.imageSection: error setting image: ${JSON.stringify(error)}`);
    }
  }

  async ingredientsSection(): Promise<void> {
    try {
      this.currentSection.loading = true;
      const imageToText: ImageToTextData = await this.imageToText();
      let ingredientsText: string = imageToText.text;
      if (this.singleOrDoubleText(ingredientsText)) {
        ingredientsText = ingredientsText.substr(0, Math.floor(ingredientsText.length/2));
      }
      const ingredientsSections: IngredientsSections = this.extractIngredientsSections(ingredientsText);
      await this.presentConfirmSectionModal(this.currentSection.sectionKey, imageToText.image, null, ingredientsSections);
      console.log(`AddProductModalComponent.ingredientsSection: updating the ingredients section`);
      this.setCurrentSectionData(imageToText.image, ingredientsText, ingredientsSections);
      console.log(`AddProductModalComponent.ingredientsSection: ingredients section updated`);
      this.confirmSection();
    } catch (error) {
      console.error(`AddProductModalComponent.ingredientsSection: error setting ingredients: ${JSON.stringify(error)}`);
      // if (error.message.search('EXTRACT_INGREDIENTS_ERROR') > -1) {
      //   this.presentConfirm(`Hmmm... That didn't work. Try again?`, () => {
      //     this.ingredientsSection();
      //   });
      // }
    }
  }

  private async imageToText(): Promise<ImageToTextData> {
    try {
      console.log(`AddProductModalComponent.imageToText: running imageToText function`);
      const croppedImageData: string = await this.captureAndCropImage();
      console.log(`AddProductModalComponent.imageToText: cropped croppedImageData data: ${croppedImageData}.`);
      return {
        text: await this.imageService.imageToText(croppedImageData),
        image: croppedImageData
      };
    } catch (error) {
      console.error(`AddProductModalComponent.imageToText: error capturing image and converting to text: ${JSON.stringify(error)}`);
      return this.imageToText();
    }
  }

  private async captureAndCropImage(): Promise<string> {
    try {
      console.log(`AddProductModalComponent.captureAndCropImage: running captureAndCropImage function`);
      const imageData: string = await this.captureImage();
      const croppedImageData: string = await this.presentCropImageModal(imageData);
      return croppedImageData;
    } catch (error) {
      console.error(`AddProductModalComponent.captureAndCropImage: error capturing image: ${JSON.stringify(error)}`);
      return this.captureAndCropImage();
    }
  }

  private setCurrentSectionData(croppedImageData: string, text?: string, ingredientsSections?: IngredientsSections): void {
    console.log(`AddProductModalComponent.setCurrentSectionData: unsetting loading and setting image data.`);
    this.currentSection.loading = false;
    this.currentSection.imageData = croppedImageData;
    if (text) {
      console.log(`AddProductModalComponent.setCurrentSectionData: setting text data.`);
      this.currentSection.text = text;
    } 
    if (ingredientsSections) {
      console.log(`AddProductModalComponent.setCurrentSectionData: setting ingredients sections data.`);
      this.currentSection.ingredientsSections = ingredientsSections;
    }
  }

  resetSection(): void {
    this.zone.run(() => {
      this.currentSection.imageData = '';
      this.currentSection.confirmed = false;
      this.currentSection.skipped = false;
      this.currentSection.loading = false;
      if (this.currentSection.text) {
        this.currentSection.text = '';
      }
      if (this.currentSection.ingredientsSections) {
        this.currentSection.ingredientsSections = {
          ingredients: '',
          contains: '',
          traces: ''
        };
      }
    });
    this.updateFeedbackSections(this.currentSection.sectionKey, true);
  }

  private async captureImage(): Promise<string> {
    try {
      const imageData = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      console.log(`AddProductModalComponent.captureImage: imageData: ${JSON.stringify(imageData)}`);
      return imageData.dataUrl || "";
    } catch (error) {
      console.error(`AddProductModalComponent.captureImage: error from camera: ${JSON.stringify(error)}`);
      return "";
    }
  }

  private async presentConfirmSectionModal(sectionName: string, sectionImageData: string, text?: string, ingredientsSections?: IngredientsSections): Promise<void> {
    return new Promise((resolve, reject) => {
      const input: any = {
        sectionName,
        sectionImageData
      };
      if (ingredientsSections != null && ingredientsSections != undefined) {
        input.ingredientsSections = ingredientsSections;
      }
      if (text != null && text != undefined) {
        input.sectionText = text;
      }
      console.log(`AddProductModalComponent.presentConfirmSectionModal: input to the confirm section modal: ${JSON.stringify(input)}`);
      const sectionModal: HTMLIonModalElement = this.modalController.create(ConfirmSectionModalComponent, input);
      sectionModal.onDidDismiss((data) => {
        if (data.hasOwnProperty('sectionImageData')) {
          resolve();
        } else {
          reject();
        }
      });
      sectionModal.present();
    });
  }

  private async presentCropImageModal(imageBase64: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sectionModal: HTMLIonModalElement = this.modalController.create(CropImageModalComponent, {
        imageBase64
      });
      sectionModal.onDidDismiss((data) => {
        console.log(`AddProductModalComponent.presentCropImageModal: crop image modal dismissed`);
        if (data.hasOwnProperty('croppedImage')) {
          console.log(`AddProductModalComponent.presentCropImageModal: croppedImage found in modal`);
          resolve(data.croppedImage);
        } else {
          reject();
        }
      });
      sectionModal.present();
    });
  }

  private async presentConfirmProductModal(): Promise<void> {
    return new Promise((resolve, reject) => {
      const productConfirmPageModal: HTMLIonModalElement = this.modalController.create(ProductPage, {
        confirmProductMode: true,
        product: this.product
      });
      productConfirmPageModal.onDidDismiss(async (data) => {
        if (data.hasOwnProperty('confirmed') && data.confirmed) {
          console.log(`AddProductModalComponent.presentConfirmProductModal: confirmed`);
          await this.calculateReward();
          resolve();
        } else {
          reject();
        }
      });
      productConfirmPageModal.present();
    });
  }

  private async calculateReward(): Promise<void> {
    this.profileService.addToProfilePoints(AppConfig.pointAwards.addProduct[this.feedback.confirmedSectionsLength]);
  }

  private updateFeedbackSections(section: string, remove: boolean): void {
    this.zone.run(() => {
      console.log(`AddProductModalComponent.updateFeedbackSections: section to update: ${section}`);
      console.log(`AddProductModalComponent.updateFeedbackSections: current value of confirmed section: ${this.feedback.confirmedSections[section]}`);
      if (section === 'productName') {
        this.feedback.confirmedSections.productName = !remove;
      } else if (section === 'productImage') {
        this.feedback.confirmedSections.productImage = !remove;
      } else if (section === 'productIngredients') {
        this.feedback.confirmedSections.productIngredients = !remove;
      }
      console.log(`AddProductModalComponent.updateFeedbackSections: new confirmed sections: ${JSON.stringify(this.feedback.confirmedSections)}`);
      const confirmedSectionsLength = (this.feedback.confirmedSections.productImage ? 1 : 0) + (this.feedback.confirmedSections.productIngredients ? 1 : 0);
      this.feedback.pointsAwarded = AppConfig.pointAwards.addProduct[confirmedSectionsLength];
      console.log(`AddProductModalComponent.updateFeedbackSections: updated pointsAwarded in feedback: ${JSON.stringify(this.feedback)}`);
      this.feedback.confirmedSectionsLength = confirmedSectionsLength;
      console.log(`AddProductModalComponent.updateFeedbackSections: updated confirmedSectionsLength to be ${confirmedSectionsLength} in feedback: ${JSON.stringify(this.feedback)}`);
    });
  }

  private calculateNextSectionIndex(): number {
    return Math.min(this.currentSectionIndex + 1, this.sectionStates.length - 1);
  }

  private calculatePreviousSectionIndex(): number {
    return Math.max(this.currentSectionIndex - 1, 0);
  }

  private singleOrDoubleText(ingredientsText: string): boolean {
    const singleOrDoubleTextRegex: RegExp = /ingredients/ig;
    const singleOrDoubleText: string[] = ingredientsText.match(singleOrDoubleTextRegex);
    return singleOrDoubleText.length === 2;
  }

  private extractSectionTokens(ingredientsText: string): string[] {
    const ingredientsTokensRegex: RegExp = /may contain traces of|may contain trace amounts of|allergy information: contains|ingredients([\s]?[:|-]?)|contains([\s]?[:|-]?)/ig;
    const sectionTokens: string[] = ingredientsText.match(ingredientsTokensRegex);
    console.log(`AddProductModalComponent.extractIngredientsSections: section tokens: ${sectionTokens}`);
    if (!sectionTokens || sectionTokens.length === 0) {
      throw new Error(`EXTRACT_INGREDIENTS_ERROR - Couldn't find any ueful tokens in the input ingredientsText: ${ingredientsText}`);
    }
    return sectionTokens;
  }

  private extractSections(ingredientsText: string, sectionTokens: string[]): string[] {
    const sections = [];
    let section: string;
    if (sectionTokens.length === 1) {
      sections.push(ingredientsText.substring(ingredientsText.search(sectionTokens[0]) + sectionTokens[0].length).trim())
    } else {
      for (let i = 0; i < sectionTokens.length; i++) {
        if (i === 0) {
          section = ingredientsText.substring(sectionTokens[i].length, ingredientsText.search(sectionTokens[i + 1])).trim();
        } else if (i === sectionTokens.length - 1) {
          section = ingredientsText.substring(ingredientsText.search(sectionTokens[i]) + sectionTokens[i].length).trim();
        } else {
          section = ingredientsText.substring(ingredientsText.search(sectionTokens[i]) + sectionTokens[i].length, ingredientsText.search(sectionTokens[i + 1])).trim();
        }
        section = section.endsWith('.') ? section.slice(0, -1) : section;
        sections.push(section);
      }
    }
    return sections;
  }

  private extractIngredientsSections(ingredientsText: string): IngredientsSections {
    const sectionsObject: IngredientsSections = {
      ingredients: '',
      contains: '',
      traces: ''
    };
    console.log(`AddProductModalComponent.extractIngredientsSections: ingredients text from rekognition: ${ingredientsText}`);
    const sectionTokens: string[] = this.extractSectionTokens(ingredientsText);
    const sections: string[] = this.extractSections(ingredientsText, sectionTokens);
    console.log(`AddProductModalComponent.extractIngredientsSections: sections: ${sections}`);
    for (let i = 0; i < sectionTokens.length; i++) {
      if (sectionTokens[i].search(/trace/i) > -1) {
        sectionsObject.traces = sections[i];
      } else if (sectionTokens[i].search(/contain/i) > -1) {
        sectionsObject.contains = sections[i];
      } else if (sectionTokens[i].search(/ingredients/i) > -1) {
        sectionsObject.ingredients = sections[i];
      }
    }
    console.log(`AddProductModalComponent.extractIngredientsSections: sections object: ${JSON.stringify(sectionsObject)}`);
    return sectionsObject;
  }

  private presentConfirm(message: string, retryHandler: () => any) {
    let alert = this.alertCtrl.create({
      title: 'Retry',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Retry',
          handler: () => {
            retryHandler();
          }
        }
      ]
    });
    alert.present();
  }
}

interface AddSectionModel {
  sectionKey: string;
  sectionLabel: string;
  imageData: string;
  confirmed: boolean;
  skipped: boolean;
  loading: boolean;
  text?: string;
  ingredientsSections?: IngredientsSections;
}

interface AddProductFeedback {
  confirmedSections: {
    productName: boolean;
    productImage: boolean;
    // productNutrition: boolean;
    productIngredients: boolean;
  },
  confirmedSectionsLength: number;
  pointsAwarded: number;
}

export interface IngredientsSections {
  ingredients: string,
  contains: string,
  traces: string
}

interface ImageToTextData {
  image: string;
  text: string;
}
