import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { AppConfig } from '../app.config';
import { model } from 'wuzinit-common';
import { ProfileState } from '../profile/profile.state';
import { ProductService } from './product.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public confirmProductMode: boolean = false;
  public noProduct: boolean = false;
  public noProductBarcode: string = '';

  // public allergensText: WarningInfo[] = [];
  public allergenPoisonWarning: boolean = false;
  public allergenDangerWarning: boolean = false;
  // public tracesText: WarningInfo[] = [];
  public tracesPoisonWarning: boolean = false;
  public tracesDangerWarning: boolean = false;
  public ingredientsTextHTML: any = '';
  public ingredientsPoisonWarning: boolean = false;
  public ingredientsDangerWarning: boolean = false;
  public product?: model.WuzinitProduct;
  public productType: string = 'spoonacular';
  public productKeywords: string[] = [];
  public iPhone: boolean = false;

  public warnings: string[] = [];

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
    private sanitizer: DomSanitizer,
    private router: Router,
    private productService: ProductService,
    private profileState: ProfileState
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
          this.product = JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
          this.noProductBarcode = product.barcode;
        } else if (product && product.hasOwnProperty('code')) {
          console.log(`ProductPage.ngOnInit: using wuzinit product from navParams`);
          this.product = JSON.parse(JSON.stringify(product));
          await this.setAlerts();
        } else if (this.product && this.product.hasOwnProperty('id')) {
          console.log(`ProductPage.ngOnInit: using local product`);
          await this.setAlerts();
          return;
        } else {
          this.noProduct = true;
          this.product = JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
          this.noProductBarcode = product.barcode;
        }
      }
    } catch (error) {
      console.error(`ProductPage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public presentAddProductModal(): void {
    // console.log(`ProductPage.presentAddProductModal: presenting add product modal with barcode: ${this.noProductBarcode}`);
    // const addProductModal: Modal = this.modalController.create(AddProductModalComponent, {
    //   barcode: this.noProductBarcode
    // });
    // addProductModal.onDidDismiss(async (data) => {
    //   console.log(`ProductPage.presentAddProductModal: modal dismissed`);
    //   if (data.hasOwnProperty('product')) {
    //     console.log(`ProductPage.presentAddProductModal: product from modal: ${JSON.stringify(data.product)}`);
    //     this.updateWithNewProduct(data.product);
    //     this.noProduct = false;
    //     await this.setAlerts();
    //     this.displaySuccessToast();
    //   }
    // });
    // addProductModal.present();
    console.log(`ProductPage.presentAddProductModal: modal presented`);
  }

  public dismissConfirmProductMode(): void {
    // if (this.confirmProductMode) {
    //   this.viewCtrl.dismiss();
    // }
  }

  public confirmProduct(): void {
    // if (this.confirmProductMode) {
    //   this.viewCtrl.dismiss({
    //     confirmed: true
    //   });
    // }
  }

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
  //   this.updateProduct(AppConfig.emptyWuzinitProduct);
  //   this.iPhone = false;
  //   this.insufficientData = true;
  //   this.dangerWarning = false;
  //   this.poisonWarning = false;
  // }

  private async setAlerts(): Promise<void> {
    console.log(`ProductPage.setAlerts: setting the alerts for dangerous and poisonous ingredients`);
    const dangerousIngredients: string[] = this.profileState.getDangerousIngredients();
    const poisonousIngredients: string[] = this.profileState.getPoisonousIngredients();
    // this.allergensText = this.addWarnings(Object.values(this.product.details.allergens), dangerousIngredients, poisonousIngredients, 'allergens');
    // this.tracesText = this.addWarnings(Object.values(this.product.details.traces_tags), dangerousIngredients, poisonousIngredients, 'traces');
    this.ingredientsTextHTML = this.sanitizer.bypassSecurityTrustHtml(this.addAlertHighlights(this.product?.ingredientsText || ''));
    
    this.addFeedback();
  }

  addAlertHighlights(ingredientsText: string): string {
    const ingredientsTextHTML: string = ingredientsText.split(/\.\s+|\.$/).map((sentence) => {
      console.log(`ProductPage.addAlertHighlights: sentence to check: ${sentence}`);
      return sentence.split(/,\s+/).map((phrase) => {
        console.log(`ProductPage.addAlertHighlights: phrase to check: ${phrase}`);
        return phrase.split(' ').map((word) => {
          console.log(`ProductPage.addAlertHighlights: word to check: ${word}`);
          return this.matchWarnings(word) ? `<span background="danger">${word}</span>` : word;
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

  private addFeedback(): void {
    if (this.ingredientsTextHTML.hasOwnProperty('length') && this.ingredientsTextHTML.length === 0) {
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

}
