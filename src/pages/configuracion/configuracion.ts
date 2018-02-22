import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  private formStyle: FormGroup;
  public selectedTheme: String;
  //Custom
  public customBackground: String = "custom-theme-back1";
  public customButtons: String = "custom-theme-btn1"

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public settings: SettingsProvider,
    public formBuilder: FormBuilder) {
      this.formStyle = this.formBuilder.group({
        theme: ['', Validators.required],
        background: ['', Validators.required],
        buttons: ['', Validators.required],
      })
      this.formStyle.valueChanges.subscribe(this.changeTheme.bind(this));
  }

  public changeTheme() {
    let theme = this.formStyle.controls['theme'].value;
    let background = this.formStyle.controls['background'].value;
    let buttons = this.formStyle.controls['buttons'].value;
    if(theme != "custom-theme" ){
      this.settings.setActiveTheme(theme);
    } else {
      this.settings.setActiveTheme(theme 
        + " " + background
        + " " + buttons);
    }
  }

}
