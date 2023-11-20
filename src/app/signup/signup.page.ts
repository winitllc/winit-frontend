import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  userData = {
    "fName": "",
    "lName": "",
    "email": "",
    "confirmEmail": "",
    "password": ""
  };


  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  goBack() {
    console.log('this is login button');
    console.log(this.userData);
    this.navCtrl.navigateRoot('/signin');
  }

  registerAction() {
    console.log('this is register action');
    console.log(this.userData);
  }

}
