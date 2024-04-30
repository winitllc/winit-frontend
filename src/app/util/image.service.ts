import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentConfig } from '../environment.config';
import { Rekognition, S3 } from 'aws-sdk';
import { AuthState } from './auth.state';
import { util } from 'wuzinit-common';

@Injectable()
export default class ImageService {

  rekognition: Rekognition;
  s3: S3;

  constructor(
    private http: HttpClient,
    private auth: AuthState
  ) {
    const credentials: util.AWSCredentials = this.auth.getIAMCredentials();
    console.log(`ImageService.constructor: IAM credentials: ${JSON.stringify(credentials)}`);
    this.rekognition = new Rekognition({
      region: 'us-west-2',
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    });
    this.s3 = new S3({
      region: 'us-west-2',
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    });
  }

  public async imageToText(imageToConvert: string): Promise<string> {
    if (imageToConvert.includes(';base64,')) {
      imageToConvert = imageToConvert.split(';base64,')[1];
    }
    const detectTextOptions = {
      Image: {
        Bytes: new Buffer(imageToConvert, 'base64')
      }
    };
    try {
      console.log(`ImageService.imageToText: sending payload to rekognition`);
      const detectionsData: Rekognition.DetectTextResponse = await this.rekognition.detectText(detectTextOptions).promise();
      if (detectionsData.hasOwnProperty('TextDetections')) {
        const detectedText: string = detectionsData.TextDetections?.map((detection: any): string => {
          return detection.DetectedText;
        }).join(' ') || 'No text detected.';
        console.log(`ImageService.imageToText: received following detected text from rekognition: ${detectedText}`);
        return detectedText;
      } else {
        throw new Error(`Text Detections were not returned in the payload: ${JSON.stringify(detectionsData)}`);
      }
    } catch (error) {
      console.error(`ImageService.imageToText: error getting text from image: ${JSON.stringify(error)}`);
      return this.imageToText(imageToConvert);
    }
  }

  public async saveImage(imageData: string, imageKey: string): Promise<void> {
   if (imageData.includes(';base64,')) {
     imageData = imageData.split(';base64,')[1];
   }
   const newImageParams = {
     Body: new Buffer(imageData, 'base64'),
     Bucket: EnvironmentConfig.s3.bucket,
     Key: imageKey
   };
    try {
      const putObjectResponse = await this.s3.putObject(newImageParams).promise();
      console.log(`ImageService.saveImage: response from s3 putObject: ${JSON.stringify(putObjectResponse)}`);
    } catch (error) {
      console.error(`ImageService.saveImage: error uploading the image to s3: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
