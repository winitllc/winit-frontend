import { Component, OnInit } from '@angular/core';
import { SpoonacularSearchResultProduct, SpoonacularProduct, SpoonacularSearchResult } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  public products: SpoonacularSearchResultProduct[] = [];
  private productSearchResponse: SpoonacularSearchResult = JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
  private searchedText: string = '';

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    console.log(`ResultsPage.ngOnInit: beginning of OnInit`);
    this.route.queryParams.subscribe((params) => {
      const navParams = this.router.getCurrentNavigation()?.extras.state || {};
      // console.log(`ResultsPage.ngOnInit: nav params: ${JSON.stringify(navParams)}`);
      this.productSearchResponse = JSON.parse(navParams['productSearchResponse']);
      this.searchedText = navParams['searchedText'];
      this.products = this.productSearchResponse.products;
      console.log(`ResultsPage.ngOnInit: searchedText: ${this.searchedText}`);
      console.log(`ResultsPage.ngOnInit: products: ${JSON.stringify(this.products)}`);
      console.log(`ResultsPage.ngOnInit: productSearchResponse: ${JSON.stringify(this.productSearchResponse)}`);
    });
    // this.productSearchResponse = JSON.parse(this.route.snapshot.paramMap.get('productSearchResponse'));
    // this.searchedText = this.route.snapshot.paramMap.get('searchedText');
    // this.products = Object.values(this.productSearchResponse.products);
    // console.log(`ResultsPage.ngOnInit: product search response from nav params: ${JSON.stringify(this.productSearchResponse)}`);
    // console.log(`ResultsPage.ngOnInit: searchedText from nav params: ${JSON.stringify(this.productSearchResponse)}`);
    // console.log(`ResultsPage.ngOnInit: products from nav params: ${JSON.stringify(this.products)}`);
  }

  public async select(resultProduct: SpoonacularSearchResultProduct): Promise<void> {
    try {
      console.log(`ResultsPage.select: retrieving result for ${JSON.stringify(resultProduct)}`);
      const loading = await this.loadingController.create({
        // cssClass: 'my-custom-class',
        message: `Loading product: ${resultProduct.title}`,
        // duration: 2000
      });
      await loading.present();
      const product: SpoonacularProduct = await this.productService.getProductById(resultProduct.id) || JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
      console.log(`ResultsPage.select: Product by id ${JSON.stringify(product)}`);
      this.pushToProductPage(product);
      await loading.dismiss();
    } catch (error) {
      console.error(`ResultsPage.checkAndroidPermissions: Error pushing to the product page: ${JSON.stringify(error)}`);
    }
  }

  private pushToProductPage(product: SpoonacularProduct): void {
    try {
      const navExtras: NavigationExtras = {
        state: {
          product
        }
      };
      // console.log(`BrowsePage.pushToResultsPage: pushing the following data to results page: ${JSON.stringify(navExtras)}`);
      this.navCtrl.navigateForward('product', navExtras);
    } catch (error) {
      console.error(`ResultsPage.checkAndroidPermissions: Error pushing to the product page: ${JSON.stringify(error)}`);
    }
  }

}
