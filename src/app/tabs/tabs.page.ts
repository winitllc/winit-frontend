import { Component } from '@angular/core';
import { AuthService } from '../util/auth.service';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { OFFUserPolicyModalComponent } from '../policies/offUserPolicyModalComponent.page';
import { OFFReUsePolicyModalComponent } from '../policies/offReUsePolicyModalComponent.page';

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
    this.checkOFFUserPolies();
  }

  async checkOFFUserPolies() {
    try {
      await this.checkOFFUserPolicy();
      await this.checkOFFReUsePolicy();
    } catch (error) {
      console.error(`TabsPage.checkOFFUserPolies [ERROR]: error ${JSON.stringify(error)}`);
    }
  }

  async checkOFFUserPolicy() {
    try {
      const openFoodFactsUserPolicy = await this.storage.get('OpenFoodFactsUserPolicy');
      if (!openFoodFactsUserPolicy) {
        const modal: HTMLIonModalElement = await this.modalCtrl.create({
          component: OFFUserPolicyModalComponent,
          showBackdrop: false
        });
        console.log(`TabsPage.checkOFFUserPolicy: modal set up`);
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log(`TabsPage.checkOFFUserPolicy: modal dismissed, data: ${JSON.stringify(data)}`);
        console.log(`TabsPage.checkOFFUserPolicy: modal dismissed, role: ${JSON.stringify(role)}`);
        if (role == 'accept') {
          console.log(`TabsPage.checkOFFUserPolicy: policy accepted: ${JSON.stringify(role)}`);
          // await this.storage.set('OpenFoodFactsUserPolicy', true);
        } else {
          this.checkOFFUserPolicy();
        }
      }
    } catch (error) {
      console.error(`TabsPage.checkOFFUserPolicy [ERROR]: error ${JSON.stringify(error)}`);
    }
  }

  async checkOFFReUsePolicy() {
    try {
      const openFoodFactsReUsePolicy = await this.storage.get('OpenFoodFactsReUsePolicy');
      if (!openFoodFactsReUsePolicy) {
        const modal: HTMLIonModalElement = await this.modalCtrl.create({
          component: OFFReUsePolicyModalComponent,
          showBackdrop: false
        });
        console.log(`TabsPage.checkOFFReUsePolicy: modal set up`);
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log(`TabsPage.checkOFFReUsePolicy: modal dismissed, data: ${JSON.stringify(data)}`);
        console.log(`TabsPage.checkOFFReUsePolicy: modal dismissed, role: ${JSON.stringify(role)}`);
        if (role == 'accept') {
          console.log(`TabsPage.checkOFFReUsePolicy: policy accepted: ${JSON.stringify(role)}`);
          // await this.storage.set('OpenFoodFactsReUsePolicy', true);
        } else {
          this.checkOFFReUsePolicy();
        }
      }
    } catch (error) {
      console.error(`TabsPage.checkOFFReUsePolicy [ERROR]: error ${JSON.stringify(error)}`);
    }
  }

}
