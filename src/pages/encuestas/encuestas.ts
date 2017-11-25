import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { setInterval } from 'timers';

@IonicPage()
@Component({
  selector: 'page-encuestas',
  templateUrl: 'encuestas.html',
})
export class EncuestasPage {

  public tab: string= "actual";
  //Actual
  public respuesta: string;
  public lastEncuesta: any;
  public currentKey: string;
  //Crear
  private formCrear: FormGroup;
  //Estadisticas
  @ViewChild('tortaCanvas') tortaCanvas;
  tortaGrafico: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController, 
    public af: AngularFireDatabase) {
    this.formCrear = this.formBuilder.group({
        pregunta: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        respuestaA: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        respuestaB: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        tiempo: ['', Validators.compose([Validators.required])]
    });
    this.initRef();
  }

  public initRef(): void {
    this.af.database.ref("/encuestas/").on('value', encuestas => {
      if(encuestas.val() != undefined){
        let props = Object.getOwnPropertyNames(encuestas.val());
        if(props.length > 0) {
          let current = encuestas.val()[props[props.length -1]];
          if(current.termina > new Date().getTime()){
            if(current.terminado == 0) {
              this.lastEncuesta = current;
              this.currentKey = props[props.length -1];
              this.getTime();
            }
          } else {
            this.setTerminado(props[props.length -1]);
          }
        } else {
          this.tab = "estadisticas";
        }
      }
    })
  }

  private setTerminado(key: string): void {
    this.lastEncuesta = undefined;
    this.af.list("/encuestas").update(key, {
      terminado: 1
    });
    this.tab = "estadisticas";
  }

  public hayEncuesta(): boolean {
    return this.lastEncuesta != undefined;
  }

  public crearEncuesta(){
    let prompt = this.alertCtrl.create({ title: 'Encuesta creada', buttons: [{ text: 'Ok',}] });
    prompt.present();
    let data: {} = this.formCrear.value;
    data["creado"] = new Date().getTime();
    let tiempo = 0;
    if(data["tiempo"] == "2h"){
      tiempo = 7200000;
    } else if (data["tiempo"] == "1h") {
      tiempo = 3600000;
    } else if (data["tiempo"] == "30s") {
      tiempo = 30000;
    }
    data["termina"] = data["creado"] + tiempo;
    data["terminado"] = "0";
    data["A"] = 0;
    data["B"] = 0;
    this.af.list("/encuestas").push(data);
    this.formCrear.reset();
  }

  public getTime(): void {
    setInterval( () => {
      if(this.lastEncuesta != null && this.lastEncuesta != undefined) {
        let duration = this.lastEncuesta.termina - new Date().getTime();
        let horNum = parseInt(((duration/(1000*60*60))%24) + "");
        let minNum = parseInt(((duration/(1000*60))%60) + "");
        let segNum = parseInt(((duration/1000)%60) + "");
        let horas = (horNum < 10) ? "0" + horNum : horNum;
        let minutos = (minNum < 10) ? "0" + minNum : minNum;
        let segundos = (segNum < 10) ? "0" + segNum : segNum;
        if(horas <= 0 && minutos <= 0 && segundos <= 0){
          this.initRef();
        }
        this.lastEncuesta.cuenta = horas + ":" + minutos + ":" + segundos;
      }
    }, 1000)
  }

  public responder() {
    this.af.list("/encuestas").update(this.currentKey, {
      [this.respuesta]: this.lastEncuesta[this.respuesta] + 1
    });
    
    this.tab = "estadisticas";
  }

  public ionViewDidLoad() {
    /*this.tortaGrafico = new Chart(this.tortaCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ["Red", "Blue"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19],
          backgroundColor: ['#FF6384','#36A2EB',],
          hoverBackgroundColor: ["#FF6384", "#36A2EB"]
        }]
      }
    });*/
  }


}
