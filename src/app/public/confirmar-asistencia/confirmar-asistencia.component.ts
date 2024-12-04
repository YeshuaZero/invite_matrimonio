import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService } from 'src/app/core/funciones-generales.services';
import { DomSanitizer } from '@angular/platform-browser';
import { InicioService } from '../inicio.service';


@Component({
  selector: 'app-confirmar-asistencia',
  templateUrl: './confirmar-asistencia.component.html',
  standalone: true,
  styleUrls: ['./confirmar-asistencia.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class ConfirmarAsistenciaComponent implements OnInit {

  loading = false;
  usarGoogleForms = false;
  form = this.funcionesGeneralesService.translate('Inicio.confirmacionInvitados.linkFormulario');
  linkForm = this.sanitizer.bypassSecurityTrustResourceUrl(this.form);

  listaInvitados: any = [
    {
      nombre: 'Familia Novio', invitados: [
        { nombre: 'Jesús David López Piedrahita' },
        { nombre: 'Cristhian Fernando López' },
        { nombre: 'Maria Alejandra López' },
        { nombre: 'Nestor León López' },
      ]
    },
    { nombre: 'Familia Novia', invitados: [
        { nombre: 'Alex Giraldo' },
        { nombre: 'Luz Adriana Saenz' },
        { nombre: 'Ana Maria Giraldo Saenz' },
        { nombre: 'Isabella Giraldo Saenz' }
      ]
    },
    {
      nombre: 'Amigos', invitados: [
        { nombre: 'Alex Giraldo' },
        { nombre: 'Luz Adriana Saenz' },
        { nombre: 'Ana Maria Giraldo Saenz' },
        { nombre: 'Isabella Giraldo Saenz' }
      ]
    }
  ];

  dataConfirmacion: any = {};

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<ConfirmarAsistenciaComponent>,
    private readonly sanitizer: DomSanitizer,
    private readonly inicioService: InicioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.obtenerConfirmados();
  }

  cerrar() {
    this.dialogRef.close();
  }

  enviar() {
    console.log('dataConfirmacion:', this.dataConfirmacion);
    const data:any = {nombre: this.dataConfirmacion.invitado.nombre, asistencia: this.dataConfirmacion.asistencia == '1', fecha: this.funcionesGeneralesService.formatearFecha(new Date(), 'dd/MM/yyyy')};
    if (this.dataConfirmacion.infoAdicional) data.infoAdicional = this.dataConfirmacion.infoAdicional;
    console.log('data:', data);
    this.inicioService.agregarConfirmado(data).then(() => {
      console.log('Datos guardados con éxito.');
    }, ()=> {
      console.log('Error.');
    });
  }

  // Consultar datos
  obtenerConfirmados() {
    this.inicioService.getData('usuarios').then((resp: any) => {
      console.log('Datos consultados:', resp);
    });
  }

}
