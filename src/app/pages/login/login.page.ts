import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  message: string = '';
  userName: string = '';
  password: string = '';
  constructor(private _dataService: DataService, private router: Router, public alertController: AlertController) {
    if (localStorage.getItem('dataSesion')) this.router.navigate(['listado']);
  }

  ngOnInit() {}

  login() {
    if(this.userName == '' || this.password == ''){
      this.alert('Disculpe debe especificar un nombre de usuario y una clave.');
    }else{
      this._dataService.login(this.userName, this.password).subscribe(
        ({ sessionTokenBck, firstName, lastName, email }) => {
          localStorage.setItem(
            'dataSesion',
            JSON.stringify({ sessionTokenBck, firstName, lastName, email })
          );
          this.router.navigate(['listado']);
        },
        (err) => {
          this.alert(err.error);
        }
      );
    }
  }

  async alert(message: string) {
      const alert = await this.alertController.create({        
        message,
        buttons: ['Aceptar'],
      });
      await alert.present();
  }
}
