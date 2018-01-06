import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  public selectedTheme: String;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private settings: SettingsProvider) {
  }

  public changeTheme(theme: string) {
    this.settings.setActiveTheme(theme);
  }

}
