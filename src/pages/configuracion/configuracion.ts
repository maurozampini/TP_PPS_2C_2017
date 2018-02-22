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
  //Custom
  public customBackground: String = "custom-theme-back1";
  public customButtons: String = "custom-theme-btn1"

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private settings: SettingsProvider) {
  }

  public changeTheme() {
    if(this.selectedTheme != "custom-theme" ){
      this.settings.setActiveTheme(this.selectedTheme);
    } else {
      this.settings.setActiveTheme(this.selectedTheme 
        + " " + this.customBackground
        + " " + this.customButtons);
    }
  }

}
