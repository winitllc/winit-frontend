import { Component, ViewChild, ElementRef } from "@angular/core";
import { ViewController, NavController, NavParams, IonicPage } from "ionic-angular";
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";

@IonicPage()
@Component({
  selector: 'wuzinit-crop-image',
  templateUrl: 'cropImageModal.html'
})
export class CropImageModalComponent {

  public imageBase64: string = '';
  public croppedImage: string = '';
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  private counter: number = 0;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.imageBase64 = this.navParams.get('imageBase64');
  }

  ngAfterContentChecked(): void {
    if (++this.counter >= 5 && this.counter < 6) {
      this.flipHorizontal();
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(`CropImageModalComponent.imageCropped: imageCropped called`);
    this.croppedImage = event.base64;
  }

  async crop(): Promise<void> {
    console.log(`CropImageModalComponent.crop: dismissing with the cropped image`);
    this.viewCtrl.dismiss({
      croppedImage: this.croppedImage
    });
  }

  imageLoaded() {
    console.log('CropImageModal.imageLoaded: Image loaded');
  }

  cropperReady() {
    console.log('CropImageModal.cropperReady: Cropper ready');
  }

  loadImageFailed() {
    console.log('CropImageModal.loadImageFailed: Load failed');
  }

  rotateLeft() {
    this.imageCropper.rotateLeft();
  }

  rotateRight() {
    this.imageCropper.rotateRight();
  }

  flipHorizontal() {
    this.imageCropper.flipHorizontal();
  }

  flipVertical() {
    this.imageCropper.flipVertical();
  }

  resetImage() {
    this.imageCropper.resetImage();
  }

  cancelModal(): void {
    this.viewCtrl.dismiss();
  }
}
