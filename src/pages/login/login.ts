import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController, Loading, LoadingController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import swal from 'sweetalert2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
//import { DomSanitizer } from '@angular/platform-browser';

//import { SocketService } from "../../services/socket.service";
 
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
  splash = true;
  safeSvg;
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

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }


  async login(user: User) {
    this.allFilled();
    if(this.valid.value){
      try {
        let loading = this.loadSpinner();
        loading.present();
        let usuarioEncontrado: boolean = false;
        (this.af.list("/usuarios").map(usuario => {
          let encontrado = false;
          usuario.forEach(element => {
            if(usuario.email == user.email && usuario.pass == user.password && !usuarioEncontrado) {
              encontrado = true;
              usuarioEncontrado = true;
              this.authAf.auth.signInWithEmailAndPassword(user.email, user.password)
                .then(result => {
                  swal({
                    title: '¡Bienvenido!',
                    text: user.email,
                    type: 'success',
                    timer: 1500
                  })
                  this.navCtrl.setRoot(HomePage)})
                .catch(error => {
                  loading.dismiss();
                  this.showToast(error.message);
                })
            }
          });
          if(!encontrado) {
            swal({
              title: 'Usuario incorrecto',
              text: 'Este usuario no existe o fue eliminado',
              type: 'error',
              timer: 1500
            })
          }
        }) as Observable<any>).subscribe();
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
      duration: 5000
    });
    return loader;
  }

}
