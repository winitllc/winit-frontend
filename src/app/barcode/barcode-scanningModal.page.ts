import { InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Barcode, BarcodeFormat, BarcodeScanner, LensFacing, StartScanOptions } from '@capacitor-mlkit/barcode-scanning';

@Component({
  templateUrl: 'barcode-scanningModal.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class BarcodeScanningModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public formats: BarcodeFormat[] = [];

  @Input()
  public lensFacing: LensFacing = LensFacing.Back;

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;

  public isTorchAvailable = false;
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;

  constructor(
    private modalCtrl: ModalController,
    private readonly ngZone: NgZone,
  ) {}

  ngOnInit() {
    console.log(`BarcodeScanningModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`BarcodeScanningModalComponent.ngAfterViewInit: after view init`);
    setTimeout(() => {
      this.startScan();
    }, 500);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  closeModal(barcode?: Barcode) {
    return this.modalCtrl.dismiss(barcode, 'confirm');
  }

  private async startScan(): Promise<void> {
    console.log(`BarcodeScanningModalComponent.startScan: start scan`);
    // Hide everything behind the modal (see `src/theme/variables.scss`)
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing,
    };

    const squareElementBoundingClientRect = this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;

    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;

    const listener = await BarcodeScanner.addListener('barcodeScanned', async (event) => {
      this.ngZone.run(() => {
        const cornerPoints = event.barcode.cornerPoints;
        if (detectionCornerPoints && cornerPoints) {
          if (
            detectionCornerPoints[0][0] > cornerPoints[0][0] ||
            detectionCornerPoints[0][1] > cornerPoints[0][1] ||
            detectionCornerPoints[1][0] < cornerPoints[1][0] ||
            detectionCornerPoints[1][1] > cornerPoints[1][1] ||
            detectionCornerPoints[2][0] < cornerPoints[2][0] ||
            detectionCornerPoints[2][1] < cornerPoints[2][1] ||
            detectionCornerPoints[3][0] > cornerPoints[3][0] ||
            detectionCornerPoints[3][1] < cornerPoints[3][1]
          ) {
            return;
          }
        }
        listener.remove();
        this.closeModal(event.barcode);
      });
    });

    await BarcodeScanner.startScan(options);
    void BarcodeScanner.getMinZoomRatio().then((result) => {
      this.minZoomRatio = result.zoomRatio;
    });
    void BarcodeScanner.getMaxZoomRatio().then((result) => {
      this.maxZoomRatio = result.zoomRatio;
    });
  }

  private async stopScan(): Promise<void> {
    // Show everything behind the modal again
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }

  public setZoomRatio(event: InputCustomEvent): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }
}
