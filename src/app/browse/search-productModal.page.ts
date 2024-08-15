import { InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'search-productModal.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  selector: 'search-product',
  styleUrls: ['search-productModal.page.scss']
})
export class SearchProductModalComponent implements OnInit, AfterViewInit, OnDestroy {

  public searchInput: string = '';

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log(`SearchProductModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`SearchProductModalComponent.ngAfterViewInit: after view init`);
    setTimeout(() => {
      this.resetInput();
    }, 500);
  }

  public ngOnDestroy(): void {
    console.log(`SearchProductModalComponent.ngOnDestroy: destroying view`);
    this.resetInput();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async search() {
    console.log(`SearchProductModalComponent.search: start search with input: ${this.searchInput}`);
    return this.modalCtrl.dismiss(this.searchInput, 'confirm');
  }

  private async resetInput(): Promise<void> {
    this.searchInput = '';
  }
}
