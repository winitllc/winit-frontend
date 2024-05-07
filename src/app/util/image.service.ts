import { Injectable } from '@angular/core';
import { EnvironmentConfig } from '../environment.config';
import { DetectTextCommand, DetectTextCommandInput, RekognitionClient } from "@aws-sdk/client-rekognition";
import { AuthState } from './auth.state';
import { util } from 'wuzinit-common';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export default class ImageService {

  credentials: util.AWSCredentials;
  // rekognitionClient;

  constructor(
    private auth: AuthState
  ) {
    const credentials: util.AWSCredentials = this.auth.getIAMCredentials();
    this.credentials = credentials;
    console.log(`ImageService.constructor: IAM credentials: ${JSON.stringify(credentials)}`);
    // this.rekognitionClient = new RekognitionClient({
    //   region: 'us-west-2',
    //   credentials: {
    //     accessKeyId: this.credentials.accessKeyId,
    //     secretAccessKey: this.credentials.secretAccessKey
    //   },
    // });
  }

  public async imageToText(imageToConvert: string) {
    console.log(`ImageService.imageToText: image to convert to text: ${imageToConvert}`);
    try {
      const rekognitionClient = new RekognitionClient({
        region: 'us-west-2',
        credentials: {
          accessKeyId: this.credentials.accessKeyId,
          secretAccessKey: this.credentials.secretAccessKey
        },
      });
      console.log(`ImageService.imageToText: rekognition client set up`);
      // const bytes = new Uint8Array(imageToConvert.length);
      // bytes.forEach((byte, idx) => {
      //   bytes.set([imageToConvert.charCodeAt(idx)], idx);
      // });
      // console.log(`ImageService.imageToText: image bytes length: ${JSON.stringify(bytes.length)}`);
      const bytes = new TextEncoder().encode(imageToConvert);
      const detectTextOptions: DetectTextCommandInput = {
        Image: {
          // Bytes: bytes
          S3Object: {
            Bucket: 'wuzinit-product-images-bucket',
            Name: 'wuzinit-text.jpg'
          }
        }
      };
      // const contents = await Filesystem.readFile({
      //   path: imageToConvert
      // });
      // console.log(`ImageService.imageToText: image bytes length: ${JSON.stringify(contents)}`);
      // const detectTextOptions: DetectTextCommandInput = {
      //   "Image": {
      //     "Bytes": new TextEncoder().encode(contents.data as string)
      //     // "Bytes": bytes
      //   }
      // };
      console.log(`ImageService.imageToText: detect text options: ${JSON.stringify(detectTextOptions)}`);
      const rekognitionCommand = new DetectTextCommand(detectTextOptions);
      const rekognitionResponse = await rekognitionClient.send(rekognitionCommand);
      console.log(`ImageService.imageToText: response from rekognition: ${JSON.stringify(rekognitionResponse)}`);
      return 'TBD';
    } catch (error) {
      console.error(`ImageService.imageToText: error using rekognition: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  // public async saveImage(imageData: string, imageKey: string): Promise<void> {
  //  if (imageData.includes(';base64,')) {
  //    imageData = imageData.split(';base64,')[1];
  //  }
  //  const newImageParams = {
  //    Body: new Buffer(imageData, 'base64'),
  //    Bucket: EnvironmentConfig.s3.bucket,
  //    Key: imageKey
  //  };
  //   try {
  //     const putObjectResponse = await this.s3.putObject(newImageParams).promise();
  //     console.log(`ImageService.saveImage: response from s3 putObject: ${JSON.stringify(putObjectResponse)}`);
  //   } catch (error) {
  //     console.error(`ImageService.saveImage: error uploading the image to s3: ${JSON.stringify(error)}`);
  //     throw error;
  //   }
  // }
}
