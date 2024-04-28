import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, ActionSheetController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { AppConfig } from '../app.config';
import { SpoonacularProduct, SpoonacularProductIngredient, SpoonacularSearchResult } from './product.model';
import { model } from 'wuzinit-common';
import { ProfileState } from '../profile/profile.state';
import { ProductService } from './product.service';
import { AddProductModalPage } from './addProductModal.page';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public confirmProductMode: boolean = false;
  public noProduct: boolean = false;
  public noProductBarcode: string = '';

  public allergensText: WarningInfo[] = [];
  public allergenPoisonWarning: boolean = false;
  public allergenDangerWarning: boolean = false;
  public tracesText: WarningInfo[] = [];
  public tracesPoisonWarning: boolean = false;
  public tracesDangerWarning: boolean = false;
  public ingredientsText: WarningInfo[] = [];
  public ingredientsPoisonWarning: boolean = false;
  public ingredientsDangerWarning: boolean = false;
  public spoonacularProduct: SpoonacularProduct = JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
  public wuzinitProduct?: model.WuzinitProduct;
  public productType: string = 'spoonacular';
  public productKeywords: string[] = [];
  public iPhone: boolean = false;

  public insufficientData: boolean = true;
  public dangerWarning: boolean = false;
  public poisonWarning: boolean = false;

  private sharingConfig: string[] = AppConfig.socialMediaSupport;

  constructor(
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private profileState: ProfileState,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    try {
      // await this.platform.ready();
      // await this.auth.setup();
      this.noProduct = true;
      console.log(`ProductPage.ngOnInit: beginning of OnInit`);
      const currNavigation = this.router.getCurrentNavigation();
      if (currNavigation) {
        const routerState = JSON.parse(JSON.stringify(currNavigation.extras.state));
        console.log(`ProductPage.ngOnInit: routerState: ${JSON.stringify(routerState)}`);
        const confirmProductMode: boolean = Boolean(routerState['confirmProductMode']);
        this.confirmProductMode = confirmProductMode;
        const product = routerState['product'];
        console.log(`ProductPage.ngOnInit: product from navParams: ${JSON.stringify(product)}`);
        this.productType = product.type;
        this.noProduct = false;
        if (product && product.hasOwnProperty('message') && product.message === AppConfig.controlMessages.noProduct) {
          this.noProduct = true;
          this.spoonacularProduct = JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
          this.noProductBarcode = product.barcode;
        } else if (product && product.hasOwnProperty('id')) {
          console.log(`ProductPage.ngOnInit: using spoonacular product from navParams`);
          this.spoonacularProduct = product;
          this.updateSpoonacularProduct(product);
          await this.setAlerts();
          // return this.cache.putCurrentProduct(this.spoonacularProduct);
        // } else if (product && product.hasOwnProperty('code')) {
        //   console.log(`ProductPage.ngOnInit: using wuzinit product from navParams`);
        //   this.wuzinitProduct = AppConfig.emptyWuzinitProduct;
        //   this.updateWithNewProduct(product);
        //   await this.setAlerts();
        //   return this.cache.putCurrentProduct(this.wuzinitProduct);
        } else if (this.spoonacularProduct && this.spoonacularProduct.hasOwnProperty('id')) {
          console.log(`ProductPage.ngOnInit: using local product`);
          await this.setAlerts();
          return;
        } else {
          this.noProduct = true;
          this.spoonacularProduct = JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
          this.noProductBarcode = product.barcode;
        }
      }
    } catch (error) {
      console.error(`ProductPage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async searchKeyword(keyword: string): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        // cssClass: 'my-custom-class',
        message: `Searching for: ${keyword}`,
        // duration: 2000
      });
      await loading.present();
      console.log(`ProductPage.searchKeyword: selected from keyword: ${keyword}`);
      const productSearchResponse: SpoonacularSearchResult = await this.productService.searchProductByText(keyword) || JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
      console.log(`ProductPage.searchKeyword: product search by keyword response: ${JSON.stringify(productSearchResponse)}`);
      this.pushToResultsPage(productSearchResponse, keyword);
      await loading.dismiss();
    } catch (error) {
      console.error(`ProductPage.searchKeyword: Error searching by text: ${JSON.stringify(error)}`);
    }
  }

  async openModal() {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: AddProductModalPage,
      componentProps: {
        barcode: this.noProductBarcode
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`ProductPage.presentAddProductModal: modal dismissed, data: ${JSON.stringify(data)}`);
    console.log(`ProductPage.presentAddProductModal: modal dismissed, role: ${JSON.stringify(role)}`);
    if (data.hasOwnProperty('product')) {
      console.log(`ProductPage.presentAddProductModal: product from modal: ${JSON.stringify(data.product)}`);
      this.updateWithNewProduct(data.product);
      this.noProduct = false;
      await this.setAlerts();
      // this.displaySuccessToast();
      console.log(`ProductPage.presentAddProductModal: display a success`);
    }

    console.log(`ProductPage.openModal: data: ${JSON.stringify(data)}`);
    if (role === 'confirm') {
      console.log(`ProductPage.openModal: confirm pressed`)
    }
  }

  // public presentAddProductModal(): void {
  //   console.log(`ProductPage.presentAddProductModal: presenting add product modal with barcode: ${this.noProductBarcode}`);
  //   const addProductModal: Modal = this.modalController.create(AddProductModalComponent, {
  //     barcode: this.noProductBarcode
  //   });
  //   addProductModal.onDidDismiss(async (data) => {
  //     console.log(`ProductPage.presentAddProductModal: modal dismissed`);
  //     if (data.hasOwnProperty('product')) {
  //       console.log(`ProductPage.presentAddProductModal: product from modal: ${JSON.stringify(data.product)}`);
  //       this.updateWithNewProduct(data.product);
  //       this.noProduct = false;
  //       await this.setAlerts();
  //       this.displaySuccessToast();
  //     }
  //   });
  //   addProductModal.present();
  //   console.log(`ProductPage.presentAddProductModal: modal presented`);
  // }

  // private displaySuccessToast(): void {
  //   const toastOptions: ToastOptions = {
  //     duration: 2000,
  //     position: 'top'
  //   };
  //   toastOptions.message = 'Success!';
  //   toastOptions.styling = {
  //     backgroundColor: '#2e8b57',
  //     textColor: '#FFFFFF'
  //   };
  //   this.toaster.showWithOptions(toastOptions).subscribe((toast): void => {
  //   }, (error: any): void => {
  //     console.error(`ProductPage.addFeedback Error: ${JSON.stringify(error)}`);
  //   });
  // }

  private pushToResultsPage(productSearchResponse: SpoonacularSearchResult, searchedText: string): void {
    try {
      const navExtras: NavigationExtras = {
        state: {
          productSearchResponse,
          searchedText
        }
      };
      // console.log(`ProductPage.pushToResultsPage: pushing the following data to results page: ${JSON.stringify(navExtras)}`);
      this.navCtrl.navigateForward('results', navExtras);
    } catch (error) {
      console.error(`ProductPage.pushToResultsPage: Error pushing to the results page: ${JSON.stringify(error)}`);
    }
  }

  // private reset(): void {
  //   this.allergensText = [];
  //   this.allergenPoisonWarning = false;
  //   this.allergenDangerWarning = false;
  //   this.tracesText = [];
  //   this.tracesPoisonWarning = false;
  //   this.tracesDangerWarning = false;
  //   this.ingredientsText = [];
  //   this.ingredientsPoisonWarning = false;
  //   this.ingredientsDangerWarning = false;
  //   this.productKeywords = [];
  //   this.updateSpoonacularProduct(AppConfig.emptySpoonacularProduct);
  //   this.iPhone = false;
  //   this.insufficientData = true;
  //   this.dangerWarning = false;
  //   this.poisonWarning = false;
  // }

  private async shareVia(appName: string): Promise<void> {
    try {
      console.log(`ProductPage.shareVia: sharing via ${appName}`);
      switch (appName) {
        case 'twitter':
          await Share.share({
            title: 'Shared from Whats In It',
            text: 'Shared From @whatsinitapp',
            url: this.spoonacularProduct?.images[0]
          })
          break;
        case 'facebook':
          await Share.share({
            title: 'Shared from Whats In It',
            text: 'Shared From @whatsinitapp',
            url: this.spoonacularProduct?.images[0]
          })
          break;
        case 'whatsapp':
          await Share.share({
            title: 'Shared from Whats In It',
            text: 'Shared From @whatsinitapp',
            url: this.spoonacularProduct?.images[0]
          })
          break;
        case 'instagram':
          await Share.share({
            title: 'Shared from Whats In It',
            text: 'Shared From @whatsinitapp',
            url: this.spoonacularProduct?.images[0]
          })
          break;
      }
    } catch (error) {
      console.error(`ProductPage.shareVia: Error ${JSON.stringify(error)}`);
    }
  }

  public async addMenu() {
    const actionButtons = [];
    this.sharingConfig.forEach((appName: string): void => {
      actionButtons.push({
        text: appName,
        icon: `${appName}`,
        handler: () => {
          this.shareVia(appName);
        }
      });
    });
    actionButtons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
        actionSheet.dismiss();
      }
    });
    const actionSheet = await this.actionSheetController.create({
      header: 'Share Via',
      buttons: actionButtons
    });
    await actionSheet.present();
  }

  private async setAlerts(): Promise<void> {
    console.log(`ProductPage.setAlerts: setting the alerts for dangerous and poisonous ingredients`);
    const dangerousIngredients: string[] = this.profileState.getDangerousIngredients();
    const poisonousIngredients: string[] = this.profileState.getPoisonousIngredients();
    // this.allergensText = this.addWarnings(Object.values(this.product.details.allergens), dangerousIngredients, poisonousIngredients, 'allergens');
    // this.tracesText = this.addWarnings(Object.values(this.product.details.traces_tags), dangerousIngredients, poisonousIngredients, 'traces');
    if (this.productType === 'wuzinit') {
      console.log(`ProductPage.setAlerts: product from wuzinit to set on the page: ${JSON.stringify(this.spoonacularProduct)}`);
      this.ingredientsText = this.addWuzinitWarnings(this.wuzinitProduct ? this.wuzinitProduct.ingredientsList : [], dangerousIngredients, poisonousIngredients, 'ingredients');
    } else if (this.productType === 'spoonacular') {
      console.log(`ProductPage.setAlerts: product from spoonacular to set on the page: ${JSON.stringify(this.spoonacularProduct)}`);
      this.ingredientsText = this.addSpoonacularWarnings(this.spoonacularProduct?.ingredients || [], dangerousIngredients, poisonousIngredients, 'ingredients');
    }
    this.addFeedback();
  }

  private addFeedback(): void {
    if (this.ingredientsText.length === 0) {
      this.insufficientData = true;
      return;
    } else {
      this.insufficientData = false;
    }
    if (this.allergenPoisonWarning || this.tracesPoisonWarning || this.ingredientsPoisonWarning) {
      this.poisonWarning = true;
      return;
    }
    if (this.allergenDangerWarning || this.tracesDangerWarning || this.ingredientsDangerWarning) {
      this.dangerWarning = true;
      return;
    }
  }

  private addSpoonacularWarnings(items: SpoonacularProductIngredient[], dangerousIngredients: string[], poisonousIngredients: string[], section: string): WarningInfo[] {
    console.log(`ProductPage.addSpoonacularWarnings: adding the warnings for the ${section} section`);
    console.log(`ProductPage.addSpoonacularWarnings: items to edit: ${JSON.stringify(items)}`);
    return items.map((item: SpoonacularProductIngredient): WarningInfo => {
      console.log(`ProductPage.addSpoonacularWarnings: item to check for warnings: ${JSON.stringify(item)}`);
      const addPoisonWarning = this.checkForPoisonWarnings(item.name, poisonousIngredients, section);
      const addDangerWarning = this.checkForDangerWarnings(item.name, dangerousIngredients, section);
      return {
        name: item.name,
        warningType: addPoisonWarning ? 'poisonWarning' : (addDangerWarning ? 'dangerWarning' : '')
      };
    }).filter((info: WarningInfo) => {
      return info.name.length > 0;
    });
  }

  private addWuzinitWarnings(items: string[], dangerousIngredients: string[], poisonousIngredients: string[], section: string): WarningInfo[] {
    console.log(`ProductPage.addWuzinitWarnings: adding the warnings for the ${section} section`);
    console.log(`ProductPage.addWuzinitWarnings: items to add warnings to: ${items}`);
    return items.map((item: string): WarningInfo => {
      const addPoisonWarning = this.checkForPoisonWarnings(item, poisonousIngredients, section);
      const addDangerWarning = this.checkForDangerWarnings(item, dangerousIngredients, section);
      return {
        name: item,
        warningType: addPoisonWarning ? 'poisonWarning' : (addDangerWarning ? 'dangerWarning' : '')
      };
    }).filter((info: WarningInfo) => {
      return info.name.length > 0;
    });
  }

  private checkForPoisonWarnings(item: string, poisonousIngredients: string[], section: string): boolean {
    return poisonousIngredients.map(this.makeIngredientComparisonMapper(item, section, 'poison')).reduce(this.orReducer, false);
  }

  private checkForDangerWarnings(item: string, dangerousIngredients: string[], section: string): boolean {
    return dangerousIngredients.map(this.makeIngredientComparisonMapper(item, section, 'danger')).reduce(this.orReducer, false);
  }

  private updateWarning(section: string, type: string): void {
    switch (`${section}-${type}`) {
      case 'allergens-poison':
        this.allergenPoisonWarning = true;
        break;
      case 'traces-poison':
        this.tracesPoisonWarning = true;
        break;
      case 'ingredients-poison':
        this.ingredientsPoisonWarning = true;
        break;
      case 'allergens-danger':
        this.allergenDangerWarning = true;
        break;
      case 'traces-danger':
        this.tracesDangerWarning = true;
        break;
      case 'ingredients-danger':
        this.ingredientsDangerWarning = true;
        break;
      default:
        break;
    }
  }

  private makeIngredientComparisonMapper(item: string, section: string, type: string): (arg: string) => boolean {
    return (ingredient: string): boolean => {
      const hasWarning: boolean = item.toLocaleLowerCase().includes(ingredient.toLocaleLowerCase()) || ingredient.toLocaleLowerCase().includes(item.toLocaleLowerCase());
      if (hasWarning) {
        this.updateWarning(section, type);
      }
      return hasWarning;
    };
  }

  private orReducer(prev: boolean, current: boolean): boolean {
    return prev || current;
  }

  private updateSpoonacularProduct(newProduct: SpoonacularProduct): void {
    console.log(`ProductPage.updateSpoonacularProduct: updating product`);
    this.productType = 'spoonacular';
    this.spoonacularProduct.title = newProduct.title;
    this.spoonacularProduct.id = newProduct.id;
    this.spoonacularProduct.badges = newProduct.badges;
    this.spoonacularProduct.important_badges = newProduct.important_badges;
    this.spoonacularProduct.breadcrumbs = newProduct.breadcrumbs;
    this.spoonacularProduct.generatedText = newProduct.generatedText;
    this.spoonacularProduct.images = newProduct.images;
    this.spoonacularProduct.ingredientCount = newProduct.ingredientCount;
    this.spoonacularProduct.ingredientList = newProduct.ingredientList;
    this.spoonacularProduct.ingredients = newProduct.ingredients;
    this.spoonacularProduct.likes = newProduct.likes;
    this.spoonacularProduct.number_of_servings = newProduct.number_of_servings;
    this.spoonacularProduct.nutrition = newProduct.nutrition;
    this.spoonacularProduct.price = newProduct.price;
    this.spoonacularProduct.serving_size = newProduct.serving_size;
    this.spoonacularProduct.spoonacular_score = newProduct.spoonacular_score;

    this.productKeywords = this.spoonacularProduct.badges.map((badgeString: string): string => {
      return badgeString.replace('_', ' ');
    });

    console.log(`ProductPage.updateSpoonacularProduct: new product: ${JSON.stringify(this.spoonacularProduct)}`);
    console.log(`ProductPage.updateSpoonacularProduct: product keywords: ${JSON.stringify(this.productKeywords)}`);
  }

  private updateWithNewProduct(newProduct: model.WuzinitProduct): void {
    console.log(`ProductPage.updateWithNewProduct: updating product`);
    this.productType = 'wuzinit';
    this.wuzinitProduct = newProduct;

    console.log(`ProductPage.updateWithNewProduct: new product: ${JSON.stringify(this.wuzinitProduct)}`);
    console.log(`ProductPage.updateWithNewProduct: product keywords: ${JSON.stringify(this.productKeywords)}`);
  }

}

interface WarningInfo {
  name: string;
  warningType: string;
}
