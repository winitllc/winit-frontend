import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { SpoonacularSearchResult, SpoonacularProduct } from './product.model';
import { EnvironmentConfig } from '../environment.config';
import { AuthState } from '../util/auth.state';
import { AppConfig } from '../app.config';
import { model } from 'wuzinit-common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private authState: AuthState
  ) { }

  public async searchProductByText(query: string, offset?: number): Promise<SpoonacularSearchResult> {
    const productsByText = `${EnvironmentConfig.api.spoonacularProducts.baseUrl}${EnvironmentConfig.api.spoonacularProducts.getByText}`;
    console.log(`ProductService.searchProductByText: requesting products by query: ${query}`);
    console.log(`ProductService.searchProductByText: url: ${productsByText}`);
    try {
      const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: productsByText,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        params: {
          apiKey,
          query,
          number: '25',
          offset: offset ? offset.toString() : '0',
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.searchProductByText: result from spoonacular: ${JSON.stringify(result)}`);
      return result.data as SpoonacularSearchResult;
    } catch (error) {
      console.error(`ProductService.searchProductByText: Error getting by query ${query}`);
      console.error(`ProductService.searchProductByText: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
    }
  }

  public async getProductById(id: number): Promise<SpoonacularProduct> {
    const getProductByIdURL = `${EnvironmentConfig.api.spoonacularProducts.baseUrl}${EnvironmentConfig.api.spoonacularProducts.getById}${id}`;
    console.log(`ProductService.getProductById: requesting product by id: ${id}`);
    console.log(`ProductService.getProductById: url: ${getProductByIdURL}`);
    try {
      const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getProductByIdURL,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        params: {
          apiKey
        }
      }
      console.log(`ProductService.getProductById: request options: ${JSON.stringify(requestOptions)}`);
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getProductById: result from spoonacular: ${JSON.stringify(result)}`);
      const product: SpoonacularProduct = result.data;
      console.log(`ProductService.getProductById: product object: ${JSON.stringify(product)}`);
      product.type = 'spoonacular';
      return product;
    } catch (error) {
      console.error(`ProductService.getProductById: Error getting by id ${id}`);
      console.error(`ProductService.getProductById: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptySpoonacularProduct));
    }
  }

  public async getSpoonacularProductByBarcode(barcode: string): Promise<SpoonacularProduct | undefined> {
    const getSpoonacularProductByBarcodeURL = `${EnvironmentConfig.api.spoonacularProducts.baseUrl}${EnvironmentConfig.api.spoonacularProducts.getByCode}${barcode}`;
    console.log(`ProductService.getSpoonacularProductByBarcode: requesting product by barcode: ${barcode}`);
    console.log(`ProductService.getSpoonacularProductByBarcode: url: ${getSpoonacularProductByBarcodeURL}`);
    try {
      const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getSpoonacularProductByBarcodeURL,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        params: {
          apiKey
        }
      }
      console.log(`ProductService.getSpoonacularProductByBarcode: request options: ${JSON.stringify(requestOptions)}`);
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getSpoonacularProductByBarcode: result from spoonacular: ${JSON.stringify(result)}`);
      const product: SpoonacularProduct = result.data as SpoonacularProduct;
      console.log(`ProductService.getSpoonacularProductByBarcode: product object: ${JSON.stringify(product)}`);
      product.type = 'spoonacular';
      return product;
    } catch (error) {
      console.error(`ProductService.getSpoonacularProductByBarcode: Error getting by barcode ${barcode}`);
      console.error(`ProductService.getSpoonacularProductByBarcode: Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  // public async addProductUpdate(product: model.WuzinitProduct): Promise<model.WuzinitProduct> {
  //   const addProductUpdateURL: string = EnvironmentConfig.api.wuzinitProducts.baseUrl + EnvironmentConfig.api.wuzinitProducts.addProductUpdate;
  //   try {
  //     console.log(`ProductService.addProductUpdate: sending ${JSON.stringify(product)} to ${addProductUpdateURL}`);
  //     const addProductUpdateResponse: any = await this.http.post(addProductUpdateURL, {
  //       product
  //     }, {
  //       responseType: 'json'
  //     }).toPromise();
  //     if (addProductUpdateResponse.hasOwnProperty('data') && addProductUpdateResponse.data.hasOwnProperty('code')) {
  //       return addProductUpdateResponse.data as model.WuzinitProduct;
  //     }
  //   } catch (error) {
  //     console.error(`ProductService.addProductUpdate: Error saving the product ${JSON.stringify(product)}`);
  //     console.error(`ProductService.addProductUpdate: Error: ${JSON.stringify(error)}`);
  //   }
  // }

  public async getWuzinitProductByBarcode(code: string): Promise<model.WuzinitProduct | undefined> {
    const getWuzinitProductByBarcodeURL: string = `${EnvironmentConfig.api.wuzinitProducts.baseUrl}${EnvironmentConfig.api.wuzinitProducts.getByCode}`;
    console.log(`ProductService.getWuzinitProductByBarcode: requesting product by barcode: ${code}`);
    console.log(`ProductService.getWuzinitProductByBarcode: url: ${getWuzinitProductByBarcodeURL}`);
    try {
      const requestOptions = {
        url: getWuzinitProductByBarcodeURL,
        headers: {},
        params: {
          code
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getWuzinitProductByBarcode: result from backend: ${JSON.stringify(result)}`);
      if (result.data.hasOwnProperty('code')) {
        const product: model.WuzinitProduct = result.data;
        product.type = 'wuzinit';
        return product;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(`ProductService.getWuzinitProductByBarcode: Error getting by barcode ${code}`);
      console.error(`ProductService.getWuzinitProductByBarcode: Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }
}
