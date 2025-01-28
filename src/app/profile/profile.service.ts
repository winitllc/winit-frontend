import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { model, view } from 'wuzinit-common';
import { EnvironmentConfig } from '../environment.config';
import { ProfileState } from './profile.state';
import { CacheService } from '../util/cache.service';
import { AuthState } from '../util/auth.state';
import { AuthService } from '../util/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, retry } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private cache: CacheService,
    private state: ProfileState,
    private authState: AuthState,
    private http: HttpClient
  ) {}

  async fetchProfileData() {

    this.getUserProfileData().subscribe(
      async (data: any) => {
        // Handle the response data
        console.log('ProfileService.fetchProfileData: data fetched from api/accounts/me');
        console.log(`ProfileService.fetchProfileData: ${JSON.stringify(data)}`);
        const profileData = data['data'];
        console.log(`ProfileService.fetchProfileData: profile data: ${JSON.stringify(profileData)}`);
        console.log(`ProfileService.fetchProfileData: profile name: ${profileData.profile.showName}`);
        // console.log(profileData['healthProfiles'][0]['id'] != undefined);
        this.state.setProfile(profileData);
        if (profileData['healthProfiles'] != undefined) {
          if (profileData['healthProfiles'].length > 0) {
            this.getHealthProfileData(profileData);
          }
        }
        const profileID = profileData['id'];
        console.log(`ProfileService.fetchProfileData: profile ID to fetch: ${profileID}`);
        const profilePoints: model.WuzinitPoints = await this.getProfilePoints(`${profileID}`);
        console.log(`ProfileService.fetchProfileData: profile points: ${JSON.stringify(profilePoints)}`);
        this.state.setProfilePoints(profilePoints);
      },
      (error) => {
        // Handle errors
        console.error(`ProfileService.fetchProfileData: [ERROR] ${JSON.stringify(error)}`);
      }
    );
  }

  getHealthProfileData(profileData: any) {
    this
      .getUserHealthProfile(profileData['healthProfiles'][0]['id'])
      .subscribe(
        (data: any) => {
          // Handle the response data
          console.log('ProfileService.getHealthProfileData: data fetched from health profile api');
          console.log(`ProfileService.getHealthProfileData: ${JSON.stringify(data)}`);
          const healthProfileData = data['data'];
          this.state.setHealthProfile(data['data']);
          console.log(`ProfileService.getHealthProfileData: health profile data ${JSON.stringify(healthProfileData)}`);
        },
        (error) => {
          // Handle errors
          console.error(`ProfileService.getHealthProfileData: [ERROR] ${JSON.stringify(error)}`);
        }
      );
  }

  async deleteProfileData(): Promise<void> {
    try {
      console.log('ProfileService.deleteProfileData: deleteProfileData initiated');
      const returnValue = await this.deleteProfile();
      console.log(`ProfileService.deleteProfileData: profile deleted; return value: ${JSON.stringify(returnValue)}`);
      console.log('ProfileService.deleteProfileData: deleteProfileData complete');
    } catch (error) {
      console.error(`ProfileService.deleteProfileData: [ERROR] ${JSON.stringify(error)}`);
    }
  }

  getUserProfileData(): Observable<any[]> {
    AuthService.AccessToken = AuthService.AccessToken.replace(/\s+$/, '');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + AuthService.AccessToken,
      // Add any other headers if needed
    });

    return this.http
      .get<any>(`https://winitclinic.com/api/v1/accounts/me`, {
        headers,
      })
      .pipe(retry(2)); 
  }

  getUserHealthProfile(id: any): Observable<any[]> {
    AuthService.AccessToken = AuthService.AccessToken.replace(/\s+$/, '');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + AuthService.AccessToken,
      // Add any other headers if needed
    });

    return this.http
      .get<any>(
        `https://winitclinic.com/api/v1/patient/health-profiles/` +
          id,
        { headers }
      )
      .pipe(retry(2));
  }

  async deleteProfile(): Promise<any> {
    const deleteProfileURL = `https://winitclinic.com/api/v1/accounts/delete`;
    console.log(`ProductService.getProductByBarcode: url: ${deleteProfileURL}`);
    try {
      const requestOptions = {
        url: deleteProfileURL,
        headers: {
          Authorization: 'Bearer ' + AuthService.AccessToken
        }
      }
      console.log(`ProfileService.deleteProfile: [DEBUG] access token: ${JSON.stringify(requestOptions)}`);
      const result: HttpResponse = await CapacitorHttp.delete(requestOptions);
      console.log(`ProductService.deleteProfile: result from WINIT: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error(`ProductService.getProductByBarcode: Error: ${JSON.stringify(error)}`);
    }
  }

  public async getProfilePoints(profileId: string): Promise<model.WuzinitPoints> {
    const getProfilePoints: string = EnvironmentConfig.api.profile.baseUrl + EnvironmentConfig.api.profile.getProfilePoints;
    try {
      const requestOptions: HttpOptions = {
        url: getProfilePoints,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
        },
        params: {
          profileId
        }
      };
      const response: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProfileService.getProfilePoints: [DEBUG] response from backend: ${JSON.stringify(response)}`);
      const rawResponseData: any = response.data;
      console.log(`ProfileService.getProfilePoints: [DEBUG] rawResponseData response from backend: ${JSON.stringify(rawResponseData)}`);
      const responseData: model.WuzinitPoints = rawResponseData.data as model.WuzinitPoints || {
        profileId: '0',
        pointsBalance: 0,
        pointsPending: 0,
        pointsAllTime: 0,
        pointsUsedAllTime: 0,
        scansAllTime: 0,
        searchesAllTime: 0,
        sectionsAddedAllTime: 0,
        sectionsPending: 0,
        productsPending: 0,
        productsAddedAllTime: 0
      } as model.WuzinitPoints;
      console.log(`ProfileService.getProfilePoints: [DEBUG] data from backend: ${JSON.stringify(responseData)}`);
      return responseData;
    } catch (error) {
      console.error(`ProfileService.getProfilePoints: [ERROR] Error: ${JSON.stringify(error)}`);
      return {
        profileId: '0',
        pointsBalance: 0,
        pointsPending: 0,
        pointsAllTime: 0,
        pointsUsedAllTime: 0,
        scansAllTime: 0,
        searchesAllTime: 0,
        sectionsAddedAllTime: 0,
        sectionsPending: 0,
        productsPending: 0,
        productsAddedAllTime: 0
      } as model.WuzinitPoints;
    }
  }

  public async addToProfilePoints(pointsToAdd: number): Promise<void> {
    const profilePoints: model.WuzinitPoints = this.state.getProfilePoints();
    console.log(`ProfileService.addToProfilePoints: [DEBUG] Profile Points from state: ${JSON.stringify(profilePoints)}`);
    try {
      profilePoints.pointsBalance = profilePoints.pointsBalance + Math.max(0, pointsToAdd);
      profilePoints.pointsAllTime = profilePoints.pointsAllTime + Math.max(0, pointsToAdd);
      console.log(`ProfileService.addToProfilePoints: [DEBUG] New Profile Points: ${JSON.stringify(profilePoints)}`);
      await this.saveProfilePoints(profilePoints);
      this.state.setProfilePoints(profilePoints);
    } catch (error) {
      console.error(`ProfileService.addToProfilePoints: [ERROR] Error adding ${pointsToAdd} to profile points: ${JSON.stringify(profilePoints)}`);
      console.error(`ProfileService.addToProfilePoints: [ERROR] Error: ${JSON.stringify(error)}`);
    }
  }

  public async saveProfilePoints(profilePoints: model.WuzinitPoints): Promise<void> {
    const updateProfileURL: string = EnvironmentConfig.api.profile.baseUrl + EnvironmentConfig.api.profile.updateProfilePoints;
    try {
      const requestOptions = {
        url: updateProfileURL,
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json'
        },
        data: {
          profilePoints
        }
      };
      const response: any = await CapacitorHttp.post(requestOptions);
      console.log(`ProfileService.saveProfilePoints: [DEBUG] response from backend: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error(`ProfileService.saveProfilePoints: [ERROR] Error updating profile points: ${JSON.stringify(profilePoints)}`);
      console.error(`ProfileService.saveProfilePoints: [ERROR] Error: ${JSON.stringify(error)}`);
    }
  }

  // PRIVATE METHODS //
  /////////////////////

  private gatherDangerousIngredients(profile: view.Profile): string[] {
    const dangerousIngredientsFromUsers = profile.users
      .map((user: view.User): string[] => {
        const dangerousIngredientsFromAllergies: string[] =
          user.allergies
            ?.map((allergy: model.Allergy): string[] => {
              return allergy.dangerousIngredients || [];
            })
            .flat()
            .filter((value: string): boolean => {
              return Boolean(value);
            }) || [];
        console.log(
          `ProfileService.gatherDangerousIngredients: [DEBUG] dangerousIngredientsFromAllergies ${JSON.stringify(
            dangerousIngredientsFromAllergies
          )}`
        );
        const dangerousIngredientsFromConditions: string[] =
          user.medicalConditions
            ?.map((condition: model.Medical): string[] => {
              return condition.dangerousIngredients || [];
            })
            .flat()
            .filter((value: string): boolean => {
              return Boolean(value);
            }) || [];
        console.log(
          `ProfileService.gatherDangerousIngredients: [DEBUG] dangerousIngredientsFromConditions ${JSON.stringify(
            dangerousIngredientsFromConditions
          )}`
        );
        return dangerousIngredientsFromAllergies.concat(
          dangerousIngredientsFromConditions
        );
      })
      .flat()
      .filter((value: string, index: number, self: string[]) => {
        return self.indexOf(value) === index;
      });
    const dangerousIngredientsFromProfile = profile.lifestyleDiets
      ? profile.lifestyleDiets
          .map((diet: model.Lifestyle): string[] => {
            return diet.dangerousIngredients || [];
          })
          .flat()
          .filter((value: string): boolean => {
            return Boolean(value);
          })
      : [];
    const dangerousIngredients: string[] = dangerousIngredientsFromUsers.concat(
      dangerousIngredientsFromProfile
    );
    console.log(
      `ProfileService.gatherDangerousIngredients: [DEBUG] we gathered these dangerous ingredients from the profile: ${JSON.stringify(
        dangerousIngredients
      )}`
    );
    return dangerousIngredients;
  }

  private gatherPoisonousIngredients(profile: view.Profile): string[] {
    const poisonousIngredients = profile.users
      .map((user: view.User): string[] => {
        const poisonousIngredientsFromAllergies: string[] =
          user.allergies
            ?.map((allergy: model.Allergy): string[] => {
              return allergy.poisonousIngredients || [];
            })
            .flat()
            .filter((value: string): boolean => {
              return Boolean(value);
            }) || [];
        console.log(
          `ProfileService.gatherPoisonousIngredients: [DEBUG] poisonousIngredientsFromAllergies ${JSON.stringify(
            poisonousIngredientsFromAllergies
          )}`
        );
        const poisonousIngredientsFromConditions: string[] =
          user.medicalConditions
            ?.map((condition: model.Medical): string[] => {
              return condition.poisonousIngredients || [];
            })
            .flat()
            .filter((value: string): boolean => {
              return Boolean(value);
            }) || [];
        console.log(
          `ProfileService.gatherPoisonousIngredients: [DEBUG] poisonousIngredientsFromConditions ${JSON.stringify(
            poisonousIngredientsFromConditions
          )}`
        );
        return poisonousIngredientsFromAllergies.concat(
          poisonousIngredientsFromConditions
        );
      })
      .flat()
      .filter((value: string, index: number, self: string[]) => {
        return self.indexOf(value) === index;
      });
    console.log(
      `ProfileService.gatherPoisonousIngredients: [DEBUG] we gathered these poisonous ingredients from the profile: ${JSON.stringify(
        poisonousIngredients
      )}`
    );
    return poisonousIngredients;
  }

  private async getProfileByEmail(email: string): Promise<view.Profile | null> {
    const getProfileUrl: string =
      EnvironmentConfig.api.profile.baseUrl +
      EnvironmentConfig.api.profile.getByEmail;
    try {
      const requestOptions = {
        url: getProfileUrl,
        headers: this.authState.getAuthHeaders(),
        params: {
          profileEmail: email,
        },
      };
      const profileResponse: HttpResponse = await CapacitorHttp.get(
        requestOptions
      );
      console.log(
        `ProfileService.getProfileByEmail: [DEBUG] response from back end: ${JSON.stringify(
          profileResponse
        )}`
      );
      if (
        profileResponse.hasOwnProperty('data') &&
        JSON.parse(profileResponse.data).hasOwnProperty('data') &&
        JSON.parse(profileResponse.data).data.hasOwnProperty('id')
      ) {
        return JSON.parse(profileResponse.data).data as view.Profile;
      } else {
        return null;
      }
    } catch (error) {
      console.error(
        `ProfileService.getProfileByEmail: [ERROR] Error getting profile by email: ${email}`
      );
      console.error(
        `ProfileService.getProfileByEmail: [ERROR] Error: ${JSON.stringify(
          error
        )}`
      );
      return null;
    }
  }
}

const USER_NOT_FOUND = 'user not found';
const UNKNOWN_USER: view.Profile = {
  id: '-1',
  primaryUserEmail: USER_NOT_FOUND,
  users: [
    {
      id: '-1',
      username: USER_NOT_FOUND,
      email: USER_NOT_FOUND,
      name: USER_NOT_FOUND,
    } as view.User,
  ],
  points: {
    profileId: '-1',
    pointsBalance: 0,
    pointsPending: 0,
    pointsAllTime: 0,
    pointsUsedAllTime: 0,
    scansAllTime: 0,
    searchesAllTime: 0,
    sectionsAddedAllTime: 0,
    sectionsPending: 0,
    productsPending: 0,
    productsAddedAllTime: 0,
  },
};
