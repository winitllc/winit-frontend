import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

import { NavController, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { AuthService } from '../util/auth.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss']
})
export class BrowsePage implements OnInit {

  public categories: any[] = AppConfig.categories.mainCategories;
  public searchBox: string = '';

  constructor(
    // private platform: Platform,
    // public navCtrl: NavController,
    // public modalController: ModalController,
    // private androidPermissions: AndroidPermissions,
    private auth: AuthService,
    private loadingController: LoadingController,
    private profileService: ProfileService
  ) {
    // this.resetSearchbox();
  }

  async ngOnInit(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: `Loading...`
      });
      await loading.present();
      await this.auth.setup();
      let profile = await this.profileService.getProfile();
      await loading.dismiss();
      if (profile) {
        console.log(`BrowsePage.ngOnInit: already have a cached profile: ${JSON.stringify(profile)}`);
        // this.navCtrl.pop();
      } else {
        console.log(`BrowsePage.ngOnInit: calling signup page`);
        // await this.navCtrl.push(SignupPage);
        console.log(`BrowsePage.ngOnInit: signup page complete`);
      }
      // await this.checkAndroidPermissions();
      // await this.auth.setup();
      // await this.auth.fetchSpoonacularAPIKey();
    } catch (error) {
      console.error(`BrowsePage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
