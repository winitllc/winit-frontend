import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
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

  // public async updateWIIProduct(productUpdate: model.Product): Promise<number> {

  // }

  public async getWIIProductById(id: number): Promise<model.Product> {
    const getProductByIdURL = `${EnvironmentConfig.api.product.baseUrl}${EnvironmentConfig.api.product.getById}${id}`;
    console.log(`ProductService.getProductById: requesting product by id: ${id}`);
    console.log(`ProductService.getProductById: url: ${getProductByIdURL}`);
    try {
      // const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getProductByIdURL,
        headers: {
          // 'X-API-Key': apiKey
        },
        params: {
          // apiKey
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getProductById: result from spoonacular: ${JSON.stringify(result)}`);
      const product: model.Product = result.data;
      console.log(`ProductService.getProductById: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.getProductById: Error getting by id ${id}`);
      console.error(`ProductService.getProductById: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }

  public async getProductByBarcode(barcode: string): Promise<model.Product> {
    const getProductByBarcodeURL = `${EnvironmentConfig.api.product.baseUrl}${EnvironmentConfig.api.product.getByCode}${barcode}`;
    console.log(`ProductService.getProductByBarcode: requesting product by barcode: ${barcode}`);
    console.log(`ProductService.getProductByBarcode: url: ${getProductByBarcodeURL}`);
    try {
      const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getProductByBarcodeURL,
        headers: {
          'X-API-Key': apiKey
        },
        params: {
          apiKey
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getProductByBarcode: result from spoonacular: ${result}`);
      const product: model.Product = JSON.parse(result.data);
      console.log(`ProductService.getProductByBarcode: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.getProductByBarcode: Error getting by barcode ${barcode}`);
      console.error(`ProductService.getProductByBarcode: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }
}
