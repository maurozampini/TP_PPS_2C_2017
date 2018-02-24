import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController, Loading, LoadingController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
//import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  valid = new  BehaviorSubject<boolean>(false);
  selectedUser: string;
  connection;
  safeSvg;
  private SN_PASS = "ll3dkapsnrk50s";
  public pasoUna: boolean = false;
  //secondPage = SecondPagePage;

  constructor(
    public toastCtrl: ToastController,
    private authAf : AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public af: AngularFireDatabase,
    public facebook: Facebook,
    //public socketService: SocketService
  ) {
  }

  async login(user: User) {
    this.allFilled();
    if(this.valid.value){
      try {
        let loading = this.loadSpinner();
        loading.present();
        let usuarioEncontrado: boolean = false;
        let subs = (this.af.list("/usuarios").map(usuario => {
          let encontrado = false;
          usuario.forEach(element => {
            if(element.email == user.email && element.pass == user.password && !usuarioEncontrado) {
              encontrado = true;
              usuarioEncontrado = true;
              this.authAf.auth.signInWithEmailAndPassword(user.email, user.password)
                .then(result => {
                  
                  this.navCtrl.setRoot(HomePage)})
                .catch(error => {
                  loading.dismiss();
                  this.showToast(error.message);
                })
            }
          });
        }) as Observable<any>).subscribe();
        setTimeout(() => {
          subs.unsubscribe();
        }, 40000);
      } catch (error) {
            if(error.code == "auth/argument-error"){
              var mailError = "Formato de mail incorrecto";
              console.log(mailError);
              this.showToast(mailError);
            }
        }
    } else {
      this.toastCtrl.create({message: "Debe completar todos los campos", duration: 1500}).present();
    }
  }

  showToast(mensaje: string) {
    switch(mensaje)
    {
      case "The email address is badly formatted.":
      {
        mensaje = "El mail no es correcto";
        break;
      }
      case "The password is invalid or the user does not have a password.":
      {
        mensaje = "Clave incorrecta";
        break;
      }
      case "There is no user record corresponding to this identifier. The user may have been deleted.":
      {
        mensaje = "No existe un usuario con ese email.";
      }
    }
    this.toastCtrl.create({
      message: mensaje,
      cssClass: 'ToastWarning',
      duration: 2000
    }).present();
  }  

  private allFilled(): void {
    this.valid.next(this.user.email != "" && this.user.password != "");
  }

  public isInvalid(): boolean{
    return (this.user.email == undefined || this.user.password == undefined || this.user.password == "" || this.user.email == "");
  }

  SeleccionarUsuario(){
    switch(this.selectedUser){
      case "admin":{
        this.user.email ="administrador@administrador.com";
        this.user.password="111111";
        break;
      }
      case "profesor":{
        this.user.email ="profesor@profesor.com";
        this.user.password="333333";
        break;
      }
      case "administrativo":{
        this.user.email ="administrativo@administrativo.com";
        this.user.password="222222";
        break;
      }                
      case "alumno":{
        this.user.email="alumno@alumno.com";
        this.user.password="444444";
        break;
      }       
    }
  }
  private loadSpinner():Loading
  {
    let img = `<img src="../assets/images/escuela.gif">`;

    //this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(img);

    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      spinner: 'hide',
      cssClass: 'loader',
      content: img,
      duration: 0
    });
    return loader;
  }

  public githubLogin() {

  }

  public facebookLogin() {
    let loading = this.loadSpinner();
    loading.present();
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.af.database.ref("/usuarios/").once('value').then(usuarios => {
          let props = Object.keys(usuarios.val());
          let existe: boolean = false;
          props.forEach(p => {
            let usr = usuarios.val()[p];
            if(usr.email == profile['email']){
              existe = true;
            }
          });
          let lad = this.loadSpinner();
          lad.present();
          if(existe) {
            this.authAf.auth.signInWithEmailAndPassword(profile['email'], this.SN_PASS)
            .then(result => {
              this.navCtrl.setRoot(HomePage)})
            .catch(error => {
              loading.dismiss();
            })
          } else {
            let lud = this.loadSpinner();
            lud.present();
            this.authAf.auth.createUserWithEmailAndPassword(profile['email'], this.SN_PASS).then(a => {
              let data = {};
              data['apellido'] = profile['name'].replace(profile['first_name'], "");
              data['email'] = profile['email'];
              data['legajo'] = "00000";
              data['matMar'] = "Ninguna";
              data['matSab'] = "Ninguna";
              data['matVier'] = "Ninguna";
              data['nombre'] = profile['first_name']
              data['pass'] = this.SN_PASS;
              data['pres_Martes'] = "0";
              data['pres_Sabado'] = "0";
              data['pres_Viernes'] = "0";
              data['tieneFoto'] = "0";
              data['tipo'] = "alumno";
              data['turno'] = "Man";    
              this.af.list("/usuarios").push(data);
              this.navCtrl.setRoot(HomePage);
            });
          }
        });
      });
    });
  }

}
