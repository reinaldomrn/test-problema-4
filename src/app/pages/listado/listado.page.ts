import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'listado.page.html',
  styleUrls: ['listado.page.scss'],
})
export class ListadoPage implements OnInit {
  constructor(private _dataService: DataService, private router: Router) {
    if (!localStorage.getItem('dataSesion')) this.router.navigate(['login']);
  }

  dataGrillaLocal: any[] = [];
  value: string = '';
  type: string = 'like';
  star: boolean = false;

  ngOnInit() {
    this.getlist();
  }

  getlist() {
    let dataLocalStore = this.getData();
    this._dataService
      .getList(
        'contacto@tuten.cl',
        'APP_BCK',
        dataLocalStore.sessionTokenBck,
        dataLocalStore.email
      )
      .subscribe((response) => {
        response.map(
          ({
            bookingId,
            bookingTime,
            bookingPrice,
            tutenUserClient: { firstName, lastName },
            locationId: { streetAddress },
          }) => {
            this.dataGrillaLocal.push({
              bookingId,
              bookingTime,
              firstName,
              lastName,
              streetAddress,
              bookingPrice,
            });
            this.star = true;
          }
        );
        this._dataService.dataGrillaGlobal = this.dataGrillaLocal;
      });
  }

  getData(): any {
    return JSON.parse(localStorage.getItem('dataSesion'));
  }

  _keyUp(event: any): boolean {
    event.preventDefault();
    if (
      (event.keyCode < 96 || event.keyCode > 105) &&
      (event.keyCode < 48 || event.keyCode > 57)
    ) {
      return false;
    }
  }

  filter() {
    this.dataGrillaLocal =
      this.value != ''
        ? this._dataService.filter(this.type, parseFloat(this.value))
        : this._dataService.dataGrillaGlobal;
  }

  logout() {
    this._dataService.logout();
    this.router.navigate(['login']);
  }
}
