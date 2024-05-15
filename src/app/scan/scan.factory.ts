import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export default class ScanFactory {

  public padCode(barcodeData: any): string {
    return '0'.repeat(12 - barcodeData.text.length) + barcodeData.text;
  }
}
