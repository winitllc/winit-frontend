import { ActionSheetController, InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'offContributorPolicyModalComponent.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  selector: 'offPolicy',
  styleUrls: ['offContributorPolicyModalComponent.page.scss']
})
export class OFFContributorPolicyModalComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    console.log(`OFFContributorPolicyModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`OFFContributorPolicyModalComponent.ngAfterViewIn after view init`);
  }

  public ngOnDestroy(): void {
    console.log(`OFFContributorPolicyModalComponent.ngOnDestroy: destroying view`);
  }

  async decline() {
    try {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'This policy is required to add product data and images. If you decline this policy, it will close out of the Add Data wizard. Are you sure you want to decline?',
        buttons: [
          {
            text: 'Decline',
            role: 'confirm',
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      });

      actionSheet.present();

      const { role } = await actionSheet.onWillDismiss();

      if (role === 'confirm') {
        this.close();
      }
    } catch (error) {
      console.error(`OFFContributorPolicyModalComponent.decline: [ERROR] ${JSON.stringify(error)}`);
    }
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  accept() {
    return this.modalCtrl.dismiss(null, 'accept');
  }
}
