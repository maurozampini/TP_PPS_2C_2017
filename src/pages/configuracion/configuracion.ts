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
      let current = this.settings.getActiveThemeValue();
      this.formStyle = this.formBuilder.group({
        theme: [current, Validators.required],
        background: ['custom-theme-back1', Validators.required],
        buttons: ['custom-theme-btn1', Validators.required],
        toolbar: ['custom-theme-tool1', Validators.required],
        text: ['custom-theme-text1', Validators.required],
        roundBtn: ['custom-theme-btnR1', Validators.required],
        font: ['custom-theme-font1', Validators.required]
      })
      this.formStyle.valueChanges.subscribe(this.changeTheme.bind(this));
  }

  public changeTheme() {
    let theme = this.formStyle.controls['theme'].value;
    let background = this.formStyle.controls['background'].value;
    let buttons = this.formStyle.controls['buttons'].value;
    let toolbar = this.formStyle.controls['toolbar'].value;
    let text = this.formStyle.controls['text'].value;
    let roundBtn = this.formStyle.controls['roundBtn'].value;
    let font = this.formStyle.controls['font'].value;
    if(theme != "custom-theme" ){
      this.settings.setActiveTheme(theme);
    } else {
      this.settings.setActiveTheme(theme 
        + " " + background
        + " " + buttons
        + " " + toolbar
        + " " + text
        + " " + roundBtn
        + " " + font);
    }
  }

}
