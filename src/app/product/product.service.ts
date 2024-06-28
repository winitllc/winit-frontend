import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { model } from 'wuzinit-common';
import { EnvironmentConfig } from '../environment.config';
import { AuthState } from '../util/auth.state';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private authState: AuthState
  ) { }

  // public async updateWIIProduct(productUpdate: model.WuzinitProduct): Promise<number> {

  // }

  public async addNewProductUpdate(product: model.WuzinitProduct): Promise<model.WuzinitProduct> {
    const postProductUpdate = `${EnvironmentConfig.api.wuzinitProducts.baseUrl}${EnvironmentConfig.api.wuzinitProducts.addProductUpdate}`;
    console.log(`ProductService.addNewProductUpdate: requesting product by id: ${JSON.stringify(product)}`);
    console.log(`ProductService.addNewProductUpdate: url: ${postProductUpdate}`);
    try {
      // const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions: HttpOptions = {
        url: postProductUpdate,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json'
          // 'X-API-Key': apiKey
        },
        data: {
          product
        }
      }
      const result: HttpResponse = await CapacitorHttp.post(requestOptions);
      console.log(`ProductService.addNewProductUpdate: result from wuzinit: ${JSON.stringify(result)}`);
      console.log(`ProductService.addNewProductUpdate: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.addNewProductUpdate: Error getting by id ${JSON.stringify(product)}`);
      console.error(`ProductService.addNewProductUpdate: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }

  public async getProductByBarcode(barcode: string): Promise<model.WuzinitProduct> {
    const getProductByBarcodeURL = `${EnvironmentConfig.api.wuzinitProducts.baseUrl}${EnvironmentConfig.api.wuzinitProducts.getByCode}${barcode}`;
    console.log(`ProductService.getProductByBarcode: requesting product by barcode: ${barcode}`);
    console.log(`ProductService.getProductByBarcode: url: ${getProductByBarcodeURL}`);
    try {
      // const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getProductByBarcodeURL,
        headers: {
          // 'X-API-Key': apiKey
        },
        params: {
          // apiKey
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getProductByBarcode: result from wuzinit: ${result}`);
      const product: model.WuzinitProduct = JSON.parse(result.data);
      console.log(`ProductService.getProductByBarcode: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.getProductByBarcode: Error getting by barcode ${barcode}`);
      console.error(`ProductService.getProductByBarcode: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }
}
