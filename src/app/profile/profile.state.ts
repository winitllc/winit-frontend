import { Injectable } from '@angular/core';
import { model, view } from 'wuzinit-common';

@Injectable({
  providedIn: 'root'
})
export class ProfileState {

  public profile: view.Profile = JSON.parse(JSON.stringify(emptyProfile));

  private dangerousIngredients: string[] = [];
  private poisonousIngredients: string[] = [];

  constructor() { }

  reset(): void {
    this.profile = JSON.parse(JSON.stringify(emptyProfile));
    this.dangerousIngredients = [];
    this.poisonousIngredients = [];
  }

  getProfile(): view.Profile {
    return this.profile;
  }

  setProfile(profile: view.Profile): void {
    this.profile = profile;
  }

  getProfilePoints(): model.WuzinitPoints {
    return Object.assign({}, this.profile.points);
  }

  setProfilePoints(profilePoints: model.WuzinitPoints): void {
    this.profile.points = profilePoints;
  }

  getDangerousIngredients(): string[] {
    return this.dangerousIngredients;
  }

  setDangerousIngredients(dangerousIngredients: string[]): void {
    this.dangerousIngredients = dangerousIngredients;
  }

  getPoisonousIngredients(): string[] {
    return this.poisonousIngredients;
  }

  setPoisonousIngredients(poisonousIngredients: string[]): void {
    this.poisonousIngredients = poisonousIngredients;
  }
}

const emptyProfile: view.Profile = {
  id: '-1',
  primaryUserEmail: 'alfred.lurgey@wuzinit.com',
  users: [
    {
      id: '-1',
      username: 'al.lurgey',
      email: 'alfred.lurgey@wuzinit.com',
      name: 'Alfred Lurgey',
      allergies: [],
      medicalConditions: []
    }
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
    productsAddedAllTime: 0
  }
};
