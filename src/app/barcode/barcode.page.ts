import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions, ModalController } from '@ionic/angular';
import ImageService from '../util/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileState } from '../profile/profile.state';
import { ProfileService } from '../profile/profile.service';
import { Barcode, BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BarcodeScanningModalComponent } from './barcode-scanningModal.page';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class BarcodePage implements OnInit {

  loading: HTMLIonLoadingElement | null = null;
  profile: any;
  public isSupported = false;
  public isPermissionGranted = false;
  barcode: Barcode | undefined;
  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  constructor(
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
    private profileState: ProfileState,
    private profileService: ProfileService,
    private readonly ngZone: NgZone,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log(`BarcodePage.ngOnInit setting up scan page`);
      BarcodeScanner.isSupported().then((result) => {
        this.isSupported = result.supported;
      });
      BarcodeScanner.checkPermissions().then((result) => {
        this.isPermissionGranted = result.camera === 'granted';
      });
      BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener(
          'googleBarcodeScannerModuleInstallProgress',
          (event) => {
            this.ngZone.run(() => {
              console.log('googleBarcodeScannerModuleInstallProgress', event);
              const { state, progress } = event;
              this.formGroup.patchValue({
                googleBarcodeScannerModuleInstallState: state,
                googleBarcodeScannerModuleInstallProgress: progress,
              });
            });
          },
        );
      });
    } catch (error) {
      console.error(`BarcodePage.ngOnInit Error: ${JSON.stringify(error)}`);
    }
  }

  ionViewWillEnter(): void {
    console.log(`BarcodePage.ionViewWillEnter - beginning of ionViewWillEnter`);
    this.profile = this.profileState.getHealthProfile();
    console.log(`BarcodePage.ngOnInit: profile from state: ${JSON.stringify(this.profile)}`);

  }

  async scan() {
    const lensFacing = LensFacing.Back;
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: lensFacing,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(`BarcodePage.scan: data from modal: ${JSON.stringify(data)}`);
    console.log(`BarcodePage.scan: role from modal: ${JSON.stringify(role)}`);
    const barcode: Barcode | undefined = data.barcode;
    if (barcode) {
      this.barcode = barcode;
    }
  }

  resetSection() {
    
  }

  async presentLoading(loadingMessage: string, duration?: number) {
    this.dismissLoading();
    const loadingOpts: LoadingOptions = {
      message: loadingMessage,
      showBackdrop: true,
      spinner: 'circular',
      duration: duration || 2000,
      cssClass: 'loading-modal'
    };
    this.loading = await this.loadingCtrl.create(loadingOpts);

    this.loading.present();
  }

  async dismissLoading() {
    await this.loading?.dismiss();
  }
}

interface ImageToTextData {
  image: string;
  text: string;
  s3ImageKey: string;
}
