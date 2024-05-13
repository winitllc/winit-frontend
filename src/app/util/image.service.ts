import { Injectable } from '@angular/core';
import { EnvironmentConfig } from '../environment.config';
import { DetectTextCommand, DetectTextCommandInput, RekognitionClient, TextDetection } from "@aws-sdk/client-rekognition";
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AuthState } from './auth.state';
import { util } from 'wuzinit-common';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export default class ImageService {

  credentials: util.AWSCredentials;
  rekognitionClient;

  constructor(
    private auth: AuthState
  ) {
    const credentials: util.AWSCredentials = this.auth.getIAMCredentials();
    this.credentials = credentials;
    console.log(`ImageService.constructor: IAM credentials: ${JSON.stringify(credentials)}`);
    this.rekognitionClient = new RekognitionClient({
      region: 'us-west-2',
      credentials: {
        accessKeyId: this.credentials.accessKeyId,
        secretAccessKey: this.credentials.secretAccessKey
      },
    });
  }

  async callUploadToS3(imageToUpload: string): Promise<string> {
    console.log(`ImageService.callUploadToS3: image to upload ${imageToUpload}`);
    const hashName = `testName`;
    const filename = `${Date.now()}-${hashName}.jpg`;
    const imageKey = `imageToText/${filename}`;
    console.log(`ImageService.uploadImageToS3: imageKey: ${imageKey}`);
    const callUploadToS3URL = EnvironmentConfig.api.imageService.baseUrl + EnvironmentConfig.api.imageService.uploadToS3;
    const requestOptions: HttpOptions = {
      url: callUploadToS3URL,
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json'
      },
      data: {
        imageKey,
        imageToUpload
      }
    };
    console.log(`ImageService.uploadImageToS3: uploadBody prepared: ${JSON.stringify(requestOptions)}`);
    try {
      const uploadToS3Response: any = await CapacitorHttp.post(requestOptions);
      if (uploadToS3Response.status == 200) {
        console.log(`ImageService.callUploadToS3:  ${JSON.stringify(uploadToS3Response)}`);
        return imageKey;
      } else {
        throw new Error(`ImageService.callUploadToS3 - call to backend: ${JSON.stringify(uploadToS3Response)}`);
      }
    } catch (error) {
      console.error(`ImageService.callUploadToS3: error ${error}`);
      throw error;
    }
  }

  public async imageToText(imageKeyInS3: string) {
    console.log(`ImageService.imageToText: image to convert to text: ${imageKeyInS3}`);
    try {
      console.log(`ImageService.imageToText: rekognition client set up`);
      const detectTextOptions: DetectTextCommandInput = {
        Image: {
          S3Object: {
            Bucket: 'wuzinit-product-images-bucket',
            Name: imageKeyInS3
          }
        }
      };
      console.log(`ImageService.imageToText: detect text options: ${JSON.stringify(detectTextOptions)}`);
      const rekognitionCommand = new DetectTextCommand(detectTextOptions);
      const rekognitionResponse = await this.rekognitionClient.send(rekognitionCommand);
      // console.log(`ImageService.imageToText: response from rekognition: ${JSON.stringify(rekognitionResponse)}`);
      const rekognitionTextDetected: string[] = rekognitionResponse.TextDetections?.filter((detection: TextDetection) => {
        if ((detection.Confidence || 0) < 95) {
          console.log(`ImageService.imageToText: confidence: ${detection.Confidence}`);
          console.log(`ImageService.imageToText: detected text: ${detection.DetectedText}`);
        }
        return detection.Confidence && detection.Confidence >= 95;
      }).map((detection: TextDetection) => {
        return detection.DetectedText || '';
      }) || [];
      const fullText: string = rekognitionTextDetected.join(' ').split('.').join('.\n');
      console.log(`ImageService.imageToText: detected text from rekognition: ${fullText}`);
      const halfText: string = fullText.substring(0, (fullText.length / 2));
      console.log(`ImageService.imageToText: text to return: ${halfText}`);
      return halfText;
    } catch (error) {
      console.error(`ImageService.imageToText: error using rekognition: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async captureImagePhoto(): Promise<Photo> {
    console.log(`AddProductModalPage.captureImagePhoto: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 2,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      console.log(`AddProductModalComponent.captureImagePhoto: imageData: ${JSON.stringify(imageData)}`);
      return imageData || {
        "webPath":"",
        "exif":{},
        "format":"",
        "saved":false,
        "path":""
      };
    } catch (error) {
      console.error(`AddProductModalPage.captureImagePhoto: error from camera: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async captureImageDataURL(): Promise<string> {
    console.log(`AddProductModalPage.captureImageBase64: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 2,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      console.log(`AddProductModalComponent.captureImageBase64: imageData keys: ${JSON.stringify(Object.keys(imageData))}`);
      // console.log(`AddProductModalComponent.captureImageBase64: imageData: ${JSON.stringify(imageData)}`);
      return imageData.dataUrl || '';
    } catch (error) {
      console.error(`AddProductModalPage.captureImageBase64: error from camera: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async captureImageBase64(): Promise<string> {
    console.log(`AddProductModalPage.captureImageBase64: capture image selected`);
    try {
      const imageData = await Camera.getPhoto({
        quality: 2,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      console.log(`AddProductModalComponent.captureImageBase64: imageData keys: ${JSON.stringify(Object.keys(imageData))}`);
      // console.log(`AddProductModalComponent.captureImageBase64: imageData: ${JSON.stringify(imageData)}`);
      return imageData.base64String || '';
    } catch (error) {
      console.error(`AddProductModalPage.captureImageBase64: error from camera: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
