import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export default class ScanFactory {

  public padCode(barcode: string): string {
    return '0'.repeat(12 - barcode.length) + barcode;
  }
}
