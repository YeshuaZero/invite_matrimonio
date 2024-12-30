import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { InicioService } from '../inicio.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  standalone: true,
  styleUrls: ['./iniciar-sesion.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class IniciarSesionComponent implements OnInit {

  loading = false;
  dataLogin: any = {};
  hide: boolean = true;
  dataWeb: any = {};

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<IniciarSesionComponent>,
    private readonly inicioService: InicioService,
    private readonly router: Router
) {

  }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.loading = true;
    const claveSecreta = "y35hu4d4v1d";
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    const encrypted = CryptoJS.AES.encrypt(`${this.dataLogin.user}_${this.dataLogin.pass}`, CryptoJS.enc.Utf8.parse(claveSecreta), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const key = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    console.log('pass:', key);
    this.inicioService.getData(`users/${key}`).then((resp: any) => {
      console.log('resp:', resp);
      if(resp){
        if(resp.activo){
          this.consultarData(resp.id);
        } else {
          this.loading = false;
          this.funcionesGeneralesService.openDialog('Inicio.iniciarSesion.usuarioInactivo', 'Inicio.iniciarSesion.usuarioInactivoDesc', TipoEnum.ERROR);
        }
      } else {
        this.loading = false;
        this.funcionesGeneralesService.openDialog('Inicio.iniciarSesion.usuarioPassInvalido', 'Inicio.iniciarSesion.usuarioPassInvalidoDesc', TipoEnum.ERROR);
      }
    })
    .catch ((error) => {
      this.loading = false;
      console.error(error); // Si ocurre un error, se ejecuta esta línea.
      this.funcionesGeneralesService.openDialog('Inicio.iniciarSesion.usuarioPassInvalido', 'Inicio.iniciarSesion.usuarioPassInvalidoDesc', TipoEnum.ERROR);
        this.cerrar();
    })
  }

  consultarData(id: string){
    this.inicioService.getData(`dataWeb/${id}`).then((resp: any) => {
      console.log('resp:', resp);
      this.dataWeb = resp;
      this.funcionesGeneralesService.setData('id', id);
      this.funcionesGeneralesService.setData('t0k3nD1g1t4lM0m3nt5', this.dataWeb, true);
      this.funcionesGeneralesService.openDialog('Inicio.iniciarSesion.sesionOk', 'Inicio.iniciarSesion.sesionOkDesc', TipoEnum.OK);
      this.router.navigate(['/panel']);
      this.cerrar();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
