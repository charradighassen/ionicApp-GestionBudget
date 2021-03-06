import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { mobiscroll } from '@mobiscroll/angular-trial';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    email: string;
    username: string;
    password: string;
    loginForm: FormGroup;
    isLogin: boolean = true;
    attemptedSubmit: boolean = false;
    formSettings = {
        lang: 'fr',
        theme: 'md'
    };
    userData: any;
    constructor(
        private fb: FormBuilder,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public authpro: AuthProvider,
        private facebook: Facebook
    ) {
        this.loginForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            username : ['']
            
        });
    }

    presentLoading() {
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 1500
        });
        loader.present();
    }
    markFieldsDirty() {
        for (var field in this.loginForm.controls) {
            this.loginForm.controls[field].markAsDirty();
        }
    }



    errorMessages = {
        required: '{$1} required',
        minlength: 'At least 6 characters required',
        email: 'Invalid email address'
    }

    errorFor(fieldName) {
        var field = this.loginForm.controls[fieldName];
        for (var validator in field.errors) {
            if (field.errors[validator]) {
                var friendlyName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                return this.errorMessages[validator].replace('{$1}', friendlyName);
            }
        }
        return null;
    }

    signUp(ev) {
        this.attemptedSubmit = true;
        
        if (this.loginForm.valid) {
            this.authpro.signup(this.loginForm.get('email').value,this.loginForm.get('username').value,this.loginForm.get('password').value );

            this.presentLoading();

            mobiscroll.toast({
                message: 'Signed Up!',
                callback: function () {
                    this.loginForm.reset();
                    this.attemptedSubmit = false;
                }.bind(this)
            });

        } else {
            this.markFieldsDirty();
        }
    }

    logIn() {
        this.attemptedSubmit = true;
        if (this.loginForm.valid) {
           this.authpro.login(this.loginForm.get('email').value, this.loginForm.get('password').value,);

            this.presentLoading();

            mobiscroll.toast({
                message: 'Logged In! ',
                duration : '3000'
                
            });

            this.navCtrl.push('MenuPage');
        } else {
            this.markFieldsDirty();
        }
    }


    loginWithFB() {
        this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
          this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
            this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
          });
        });
      }
}
