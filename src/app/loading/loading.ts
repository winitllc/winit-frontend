import { Component, OnInit } from '@angular/core';
import { NavParams, Platform } from '@ionic/angular';
// import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
// import AppState from '../app.state';

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage implements OnInit {

  public loadingMessage: string = '';

  constructor(
    private platform: Platform,
    private navParams: NavParams,
    // private admob: AdMobFree,
    // private appState: AppState
  ) {}

  async ngOnInit(): Promise<void> {
    const loadingMessage: string = this.navParams.get('loadingMessage');
    this.loadingMessage = loadingMessage || 'Loading';
    // if (this.appState.getLoadingCount() % 10 === 3) {
    //   this.createInterstitialAd();
    // }
    // this.appState.bumpLoadingCount();
  }

  public setLoadingMessage(newMessage: string): void {
    this.loadingMessage = newMessage;
  }

  // private async createInterstitialAd(): Promise<void> {
  //   const interstitialConfig: AdMobFreeInterstitialConfig = {
  //     isTesting: true, // Remove in production
  //     id: this.platform.is('ios') ? 'ca-app-pub-5499904805238414/8324538340' : 'ca-app-pub-5499904805238414/1183920086'
  //   };
  //   try {
  //     this.admob.interstitial.config(interstitialConfig);
  //     await this.admob.interstitial.prepare();
  //     await this.admob.interstitial.show();
  //     console.error(`WuzinitApp.createInterstitialAd: interstitial is prepared with config: ${JSON.stringify(interstitialConfig)}`);
  //   } catch (error) {
  //     console.error(`WuzinitApp.createInterstitialAd: error preparing the interstitial ad: ${JSON.stringify(error)}`);
  //   }
  // }
}