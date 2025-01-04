import { Component } from '@angular/core';
import { AuthService } from '../util/auth.service';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { OFFPolicyModalComponent } from './offPolicyModalComponent.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private modalCtrl: ModalController
  ) {
    this.authService.setup();
    this.checkOFFPolicy();
  }

  async checkOFFPolicy() {
    try {
      const openFoodFactsPolicy = await this.storage.get('OpenFoodFactsPolicy');
      if (!openFoodFactsPolicy) {
        const modal: HTMLIonModalElement = await this.modalCtrl.create({
          component: OFFPolicyModalComponent,
          showBackdrop: false
        });
        console.log(`TabsPage.checkOFFPolicy: modal set up`);
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log(`TabsPage.checkOFFPolicy: modal dismissed, data: ${JSON.stringify(data)}`);
        console.log(`TabsPage.checkOFFPolicy: modal dismissed, role: ${JSON.stringify(role)}`);
        if (role == 'accept') {
          console.log(`TabsPage.checkOFFPolicy: policy accepted: ${JSON.stringify(role)}`);
          // await this.storage.set('OpenFoodFactsPolicy', true);
        } else {
          this.checkOFFPolicy();
        }
      }
    } catch (error) {
      console.error(`TabsPage.checkOFFPolicy [ERROR]: error ${JSON.stringify(error)}`);
    }
  }

}
