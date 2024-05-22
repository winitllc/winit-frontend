import { Component, NgZone } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { model, view } from 'wuzinit-common';
import { AuthService } from '../util/auth.service';
import { AllergiesService } from '../util/allergies.service';
import { ProfileService } from './profile.service';
import {
  ProfileFactory,
  EditModeProfile,
  EditModeUser,
} from './profile.factory';
import { ProfileState } from './profile.state';
import { MedicalConditionsService } from '../util/medicalConditions.service';
import { DietsService } from '../util/diets.service';
import { SymptomsService } from '../util/symptoms.service';
import { AppConfig } from '../app.config';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  providers: [ProfileService],
})
export class ProfilePage {
  public editMode: boolean = false;
  public allPossibleAllergies: model.Allergy[] = [];
  public allPossibleMedicalConditions: model.Medical[] = [];
  public allPossibleLifestyleDiets: model.Lifestyle[] = [];
  public allPossibleSymptoms: model.Symptom[] = [];
  public inAppPurchaseProducts: view.InAppPurchaseProduct[] = [];

  public nameEdit: string = '';
  public usernameEdit: string = '';
  public emailEdit: string = '';
  public allergyEdit: string[] = [];
  public conditionEdit: string[] = [];
  public symptomsEdit: string[] = [];
  profileData: any;
  healthProfileData: any;

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
    private storage: Storage,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.fetchProfileData();

      const loading = await this.loadingController.create({
        message: `Loading...`,
      });
      await loading.present();
      this.zone.run(async () => {
        const profile = await this.service.getProfile();
        console.log(
          `ProfilePage.ngOnInit: [DEBUG] profile from profile service: ${JSON.stringify(
            profile
          )}`
        );
        if (!profile) {
          throw new Error(`No profile found: ${profile}`);
        }
        this.allPossibleAllergies =
          await this.allergiesService.getAllAllergies();
        console.log(
          `ProfilePage.ngOnInit: [DEBUG] allergies received: ${JSON.stringify(
            this.allPossibleAllergies
          )}`
        );
        this.allPossibleMedicalConditions =
          await this.medicalConditionsService.getAllMedicalConditions();
        console.log(
          `ProfilePage.ngOnInit: [DEBUG] medical conditions received: ${JSON.stringify(
            this.allPossibleMedicalConditions
          )}`
        );
        this.allPossibleLifestyleDiets =
          await this.dietsService.getAllLifestyleDiets();
        console.log(
          `ProfilePage.ngOnInit: [DEBUG] lifestyles received: ${JSON.stringify(
            this.allPossibleLifestyleDiets
          )}`
        );
        this.allPossibleSymptoms = await this.symptomsService.getAllSymptoms();
        console.log(
          `ProfilePage.ngOnInit: [DEBUG] symptoms received: ${JSON.stringify(
            this.allPossibleSymptoms
          )}`
        );
      });
      await loading.dismiss();
    } catch (error) {
      console.error(
        `ProfilePage.ngOnInit Error: [ERROR] ${JSON.stringify(error)}`
      );
      throw error;
    }
  }

  async fetchProfileData() {
    const loading = await this.loadingController.create({
      message: `Loading...`,
    });

    this.service.getUserProfileData().subscribe(
      (data: any) => {
        // Handle the response data
        console.log('ProfilePage.fetchProfileData: data fetched from api/accounts/me');
        console.log(`ProfilePage.fetchProfileData: ${JSON.stringify(data)}`);
        this.profileData = data['data'];
        console.log(`ProfilePage.fetchProfileData: profile data: ${JSON.stringify(this.profileData)}`);
        console.log(`ProfilePage.fetchProfileData: profile name: ${this.profileData.profile.showName}`);
        // console.log(this.profileData['healthProfiles'][0]['id'] != undefined);
        if (this.profileData['healthProfiles'] != undefined) {
          if (this.profileData['healthProfiles'].length > 0) {
            this.getHealthProfileData();
          }
        }
      },
      (error) => {
        // Handle errors
        console.error(`ProfilePage.fetchProfileData: [ERROR] ${JSON.stringify(error)}`);
      }
    );
  }

  getHealthProfileData() {
    this.service
      .getUserHealthProfile(this.profileData['healthProfiles'][0]['id'])
      .subscribe(
        (data: any) => {
          // Handle the response data
          console.log('ProfilePage.getHealthProfileData: data fetched from health profile api');
          console.log(`ProfilePage.getHealthProfileData: ${JSON.stringify(data)}`);
          this.healthProfileData = data['data'];
          console.log(`ProfilePage.getHealthProfileData: health profile data ${JSON.stringify(this.healthProfileData)}`);
        },
        (error) => {
          // Handle errors
          console.error(`ProfilePage.getHealthProfileData: [ERROR] ${JSON.stringify(error)}`);
        }
      );
  }

  async confirmLogout(): Promise<void> {
    let alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.logout();
          },
        },
      ],
    });
    await alert.present();
  }

  // PRIVATE FUNCTIONS

  private logout(): void {
    this.auth.logout().then(async () => {
      console.log(`ProfilePage.logout: auth logout complete; returning home`);
      this.storage.remove('accessToken');
      await this.returnHome();
      await this.auth.setup();
    });
  }

  private async returnHome(): Promise<void> {
    try {
      this.navCtrl.navigateRoot('');
    } catch (error) {
      console.error(
        `ProfilePage.returnHome: Error returning to home page: ${JSON.stringify(
          error
        )}`
      );
    }
  }
}
