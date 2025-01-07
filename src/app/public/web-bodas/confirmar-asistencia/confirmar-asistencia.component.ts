import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { DomSanitizer } from '@angular/platform-browser';
import { WebBodasService } from '../web-bodas.service';


@Component({
  selector: 'app-confirmar-asistencia',
  templateUrl: './confirmar-asistencia.component.html',
  standalone: true,
  styleUrls: ['./confirmar-asistencia.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class ConfirmarAsistenciaComponent implements OnInit, OnChanges {

  loading = true;
  usarGoogleForms = false;
  form: any;
  linkForm: any;
  familia: any;

  listaInvitados: any = [];
  listaInvitadosCompleta: any = [];


  dataConfirmacion: any = {};

  @Input('id') id: any = '';
  @Input('dataWeb') dataWeb: any = {};
  @Input('mostrarCompletado') mostrarCompletado: boolean = false;
  @Output() confirmacion = new EventEmitter<any>();

  admin = false;

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    @Optional() public dialogRef: MatDialogRef<ConfirmarAsistenciaComponent>,
    private readonly sanitizer: DomSanitizer,
    private readonly webServiceService: WebBodasService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data){
      this.id = data.id;
      this.dataWeb = data.dataWeb;
    } else {
      this.admin = true;
    }
  }

  ngOnInit(): void {
    this.form = this.dataWeb.WebBodas.confirmacionInvitados.linkFormulario;
    this.linkForm = this.sanitizer.bypassSecurityTrustResourceUrl(this.form);
    this.setLista();
  }

  ngOnChanges(changes: any): void {
    if (changes?.dataWeb?.currentValue) this.setLista();
  }

  setLista(){
    setTimeout(()=>{
      this.listaInvitadosCompleta = [...this.dataWeb.Invitados.listaInvitados];
      const listaInvitados = this.listaInvitadosCompleta.filter((e: any) => e.estado == 0);
      this.listaInvitados = this.agruparPorGrupo(listaInvitados);
      this.loading = false;
    }, 500);
  }

  agruparPorGrupo(array: any[]): any[] {
    const resultado: any[] = [];

    const mapaGrupos = array.reduce((mapa, invitado) => {
      if (!mapa[invitado.grupo]) {
        mapa[invitado.grupo] = [];
      }
      mapa[invitado.grupo].push({ ...invitado });
      return mapa;
    }, {} as Record<string, { nombre: string }[]>);

    for (const [nombre, invitados] of Object.entries(mapaGrupos)) {
      resultado.push({ nombre, invitados });
    }

    return resultado;
  }

  enviar() {
    this.loading = true;

    this.dataConfirmacion.invitado.forEach((e:any) => {
          e.estado = this.dataConfirmacion.asistencia;
          e.fecha = this.funcionesGeneralesService.formatearFecha(new Date(), 'dd/MM/yyyy');
          if (this.dataConfirmacion.infoAdicional) e.infoAdicional = this.dataConfirmacion.infoAdicional;
    });

    this.webServiceService.actualizarMultiplesInvitadosDesdeArray(`dataWeb/${this.id}/Invitados/listaInvitados`, this.dataConfirmacion.invitado).then(() => {
      this.loading = false;
      this.funcionesGeneralesService.openDialog(this.dataWeb.Invitados.configuracion.confirmacionOk, this.dataWeb.Invitados.configuracion.confirmacionOkDetalle, TipoEnum.OK);
      if (this.admin) {
        this.dataConfirmacion = {};
        this.confirmacion.emit();
      }
      this.cerrar();
    }, ()=> {
      this.loading = false;
      this.funcionesGeneralesService.openDialog('Invitados.confirmacionFallo', 'Invitados.confirmacionFalloDetalle', TipoEnum.ERROR);
      this.cerrar();
    });
  }

  cerrar() {
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }

}
