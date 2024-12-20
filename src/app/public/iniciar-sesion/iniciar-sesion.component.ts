import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { InicioService } from '../inicio.service';
import * as CryptoJS from 'crypto-js';


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

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<IniciarSesionComponent>,
    private readonly inicioService: InicioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
  }

  iniciarSesion() {
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
      this.cerrar();
    })
    .catch ((error) => {
      console.error(error); // Si ocurre un error, se ejecuta esta línea.
        this.funcionesGeneralesService.openDialog('WebBodas.confirmacionInvitados.confirmacionFallo', 'WebBodas.confirmacionInvitados.confirmacionFalloDetalle', TipoEnum.ERROR)
        this.cerrar();
    })
  }

  cerrar() {
    this.dialogRef.close();
  }

}
