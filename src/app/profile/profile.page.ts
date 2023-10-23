import { Component, NgZone } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { model, view } from 'wuzinit-common';
import { AuthService } from '../util/auth.service';
import { AllergiesService } from '../util/allergies.service';
import { ProfileService } from './profile.service';
import { ProfileFactory, EditModeProfile, EditModeUser } from './profile.factory';
import { ProfileState } from './profile.state';
import { PremiumFeatureView } from '../util/premiumFeature.view';
import { MedicalConditionsService } from '../util/medicalConditions.service';
import { DietsService } from '../util/diets.service';
import { SymptomsService } from '../util/symptoms.service';
import { InAppPurchaseService } from '../util/inAppPurchase.service';
import { PremiumFeaturePurchaseService } from '../util/premiumFeaturePurchase.service';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage {

  public editMode: boolean = false;
  public allPossibleAllergies: model.Allergy[] = [];
  public allPossibleMedicalConditions: model.Medical[] = [];
  public allPossibleLifestyleDiets: model.Lifestyle[] = [];
  public allPossibleSymptoms: model.Symptom[] = [];
  public inAppPurchaseProducts: view.InAppPurchaseProduct[] = [];
  public premiumFeatureViews: PremiumFeatureView[] = [];

  public nameEdit: string = '';
  public usernameEdit: string = '';
  public emailEdit: string = '';
  public allergyEdit: string[] = [];
  public conditionEdit: string[] = [];
  public symptomsEdit: string[] = [];

  constructor(
    public state: ProfileState,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private zone: NgZone,
    private auth: AuthService,
    private allergiesService: AllergiesService,
    private service: ProfileService,
    private medicalConditionsService: MedicalConditionsService,
    private dietsService: DietsService,
    private symptomsService: SymptomsService,
    private inAppPurchaseService: InAppPurchaseService,
    private premiumFeaturePurchaseService: PremiumFeaturePurchaseService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: `Loading...`
      });
      await loading.present();
      this.zone.run(async () => {
        const profile = await this.service.getProfile();
        console.log(`ProfilePage.ngOnInit: [DEBUG] profile from profile service: ${JSON.stringify(profile)}`);
        if (!profile) {
          throw new Error(`No profile found: ${profile}`);
        }
        this.allPossibleAllergies = await this.allergiesService.getAllAllergies();
        console.log(`ProfilePage.ngOnInit: [DEBUG] allergies received: ${JSON.stringify(this.allPossibleAllergies)}`);  
        this.allPossibleMedicalConditions = await this.medicalConditionsService.getAllMedicalConditions();
        console.log(`ProfilePage.ngOnInit: [DEBUG] medical conditions received: ${JSON.stringify(this.allPossibleMedicalConditions)}`);
        this.allPossibleLifestyleDiets = await this.dietsService.getAllLifestyleDiets();
        console.log(`ProfilePage.ngOnInit: [DEBUG] lifestyles received: ${JSON.stringify(this.allPossibleLifestyleDiets)}`);
        this.allPossibleSymptoms = await this.symptomsService.getAllSymptoms();
        console.log(`ProfilePage.ngOnInit: [DEBUG] symptoms received: ${JSON.stringify(this.allPossibleSymptoms)}`);
        this.inAppPurchaseProducts = await this.inAppPurchaseService.getProducts(AppConfig.inAppPurchases);
        console.log(`ProfilePage.ngOnInit: [DEBUG] in app purchase products retrieved from apple: ${JSON.stringify(this.inAppPurchaseProducts)}`);
        this.premiumFeatureViews = await this.premiumFeaturePurchaseService.getPremiumFeatures();
        console.log(`ProfilePage.ngOnInit: [DEBUG] premium features retrieved from the backend: ${JSON.stringify(this.premiumFeatureViews)}`);
        this.setFeatures();
      });
      await loading.dismiss();
    } catch (error) {
      console.error(`ProfilePage.ngOnInit Error: [ERROR] ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private setFeatures(): void {
    const profile = this.state.getProfile();
    for (let feature of this.premiumFeatureViews) {
      feature.isActive = profile.premiumFeaturesPurchasesMade?.reduce((previous: boolean, current: model.PremiumFeaturePurchaseConfirmation) => {
        return previous || current.featureId === feature.featureId;
      }, false) || false;
    }
  }

  async confirmLogout(): Promise<void> {
    let alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  // PRIVATE FUNCTIONS

  private logout(): void {
    this.auth.logout().then(async () => {
      console.log(`ProfilePage.logout: auth logout complete; returning home`);
      await this.returnHome();
      await this.auth.setup();
    });
  }

  private async returnHome(): Promise<void> {
    try {
      this.navCtrl.navigateRoot('');
    } catch (error) {
      console.error(`ProfilePage.returnHome: Error returning to home page: ${JSON.stringify(error)}`);
    }
  }

}
