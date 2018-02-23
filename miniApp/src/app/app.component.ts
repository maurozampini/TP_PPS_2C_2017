import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SettingsProvider } from './../providers/settings/settings';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ConfiguracionPage;
  message;
  public selectedTheme: String;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private settings: SettingsProvider) {
    this.initializeApp();
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
      console.log("APP COMP: " + val);
    });
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
