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

    } catch (error) {
      console.error(`BrowsePage.ngOnInit Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
